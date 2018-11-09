'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const superagent = require('superagent');
const faker = require('faker');

const Account = require('../model/auth-account-schema');
const logger = require('../lib/logger');
const basicAuthMiddleWare = require('../lib/basic-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

const CLIENT_URL = 'http://localhost:8080';
const GOOGLE_BACKEND = 'https://www.googleapis.com/oauth2/v4/token';
const API_URL = 'http://localhost:3000/oauth/google';
const OPEN_ID_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

// adding database query function to add to amiunique route to validate if
//   username and email address are unique when a signup is called
const queryData = require('../lib/queryData');

router.post('/user/signup', jsonParser, (request, response, next) => {
  if (!request.body.password || !request.body.username || !request.body.accesscode || !request.body.email) { // eslint-disable-line
    return next(new HttpError(400, 'missing parameters'));
  }
  return Account.create(request.body.username, request.body.email,
    request.body.password, request.body.accesscode) // 1. Hash password
    .then((createdAccount) => {
      delete request.body.password;
      delete request.body.accesscode;
      logger.log(logger.INFO, 'AUTH - creating Token');
      return createdAccount.pCreateToken(); // 2. Create and save token
    })
    .then((token) => {
      logger.log(logger.INFO, 'Responding with 200 status code and a token.');
      return response.json({ token }); // 3. Return a token
    })
    .catch(next);
});

router.get('/user/auth/login', basicAuthMiddleWare, (request, response, next) => {
  // development note: this won't directly handle the authentication logic
  if (!request.account) {
    return next(new HttpError(400, 'Bad Request'));
  }
  // development note: here is assumed middleware did what it was suppose to
  return request.account.pCreateToken()
    .then((token) => {
      logger.log(logger.INFO, 'Res 200 Status & Token');
      return response.json({ token });
    })
    .catch(next);
});

const formValidator = (formData, type, callback) => {
  const { username, email } = formData;
  const searchFor = type === 'username' ? username : email;
  // setup query -- 'email' || 'username'
  const mongoFind = queryData.find(Account, type);
  let userContainer = {};
  // closure variable
  let foundMatch = false;
  queryData.query(mongoFind, function (data, error) { //eslint-disable-line
    if (error) {
      console.log('error in queryData:');
      console.log(error);
    }
    userContainer = Object.values(data);
    for (let queryLength = 0; queryLength <= userContainer.length - 1; queryLength++) {
      const checkAccount = userContainer[`${queryLength}`][type];
      if (checkAccount === searchFor) {
        console.log(`${type} found:`);
        console.log(checkAccount);
        foundMatch = true;
        return callback(foundMatch);
      }
    } // else
    console.log('right after for loop:');
    console.log(foundMatch);
    return callback(foundMatch);
  });
};

router.get('/validation/amiunique/:username/:email', jsonParser, (request, response, next) => {
  formValidator(request.params, 'username', async (userResult) => {
    let result = await userResult;
    console.log('await userResult');
    console.log(result);
    if (result) {
      // if a user is a found... don't bother checking for email
      // no dups allowed in either...
      const responseObject = { dataSent: request.params, foundUser: result };
      return response.json(responseObject);
    }

    if (!result) {
      // if user is not found... also query for email
      formValidator(request.params, 'email', async (emailResult) => {
        result = await emailResult;
        console.log('await emailResult');
        console.log(result);
        const responseObject = { dataSent: request.params, foundEmail: result };
        return response.json(responseObject);
      });
    }
  });
});

router.get('/oauth/google', (request, response, next) => {
  // Step 3
  console.log('_STEP 3_ Receiving Code');
  if (!request.query.code) {
    // !: If something goes wrong, we go back to our backend.
    response.redirect(CLIENT_URL);
  } else {
    console.log('_STEP 3.1_ Sending the code back');
    return superagent.post(GOOGLE_BACKEND)
      .type('form')
      .send({
        code: request.query.code,
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: API_URL,
      })
      .then((tokenResponse) => {
        console.log('_STEP 3.2_ Token');

        if (!tokenResponse.body.access_token) {
          response.redirect(CLIENT_URL);
        }
        // !: Remember to not save the token
        const googleToken = tokenResponse.body.access_token;

        console.log('_STEP 4_ Connecting to OpenID');

        return superagent.get(OPEN_ID_URL)
          .set('Authorization', `Bearer ${googleToken}`);
      })
      .then((openIdResponse) => {
        console.log('_STEP 4_ Getting user Data');
        console.log(openIdResponse.body);

        console.log('_STEP 5_ Creating your own ACCOUNT');
        console.log('Creating our token, account, and everything in our system');

        const username = openIdResponse.body.email.split('@')[0];
        const email = openIdResponse.body.email;
        let password = faker.internet.password();

        // right now, access code will be randomly created...
        // but will need a way to solve this in future so user can choose an access code
        // as well as use google to login
        let accesscode = faker.address.zipCode();
        accesscode = accesscode.split('-')[0];

        // uncomment for testing login afterward
        // console.log(username);
        // console.log(email);
        // console.log(password);
        // console.log(accesscode);

        // CURRENTLY... if you make an account there is no way to avoid a CONFLICT
        // Will need to add this ability
        return Account.create(username, email, password, accesscode) // 1. Hash password
          .then((createdAccount) => {
            // remove protected values from memory
            password = null;
            accesscode = null;
            logger.log(logger.INFO, 'AUTH - creating Token');
            return createdAccount.pCreateToken(); // 2. Create and save token
          })
          .then((token) => {
            logger.log(logger.INFO, 'Responding with 200 status code and a token.');
            console.log('CLIENT_URL');
            // response.redirect(`${CLIENT_URL}/finish/oauth`);
            // localStorage.setItem('hive-token', token);
            response.cookie('hive-token', token);
            response.redirect(`${CLIENT_URL}`);
            // 3. Return a token
          })
          .catch(next);
      })
      .catch((error) => {
        console.error(error);
        response.redirect(CLIENT_URL);
      });
  }
});
