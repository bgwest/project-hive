'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Account = require('../model/auth-account-schema');
const logger = require('../lib/logger');
const basicAuthMiddleWare = require('../lib/basic-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

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
      }
    } // else
    console.log('right after for loop:');
    console.log(foundMatch);
  });
  // THIS IS BAD AND NEEDS TO BE REFACTORED... but putting here now for
  // base testing on remaining form code..
  return setTimeout(() => {
    return callback(foundMatch);
  }, 1000);
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
