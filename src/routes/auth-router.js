'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Account = require('../model/auth-account-schema');
const MAS = require('../model/master-access-schema');
const queryUsers = require('../lib/queryUsers');
const logger = require('../lib/logger');
const basicAuthMiddleWare = require('../lib/basic-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

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

  console.log(MAS);
  // define query for MAS (Master Access List)
  // const findMasterCodes = queryUsers.find(MAS, 'masterCodes');
  // let masterCodes = {};
  // queryUsers.query(findMasterCodes, (data) => {
  //   masterCodes = data;
  //   return data;
  // });
  // setTimeout(() => {
  //   console.log('masterCodes:');
  //   console.log(masterCodes);
  // }, 4000);

  // define query for AuthAccount
  const findStuff = queryUsers.find(Account, 'username accessCodeHash');
  let newContainer = {};
  // fill query container with AuthAccount data
  queryUsers.query(findStuff, (data) => {
    newContainer = data;
    return data;
  });
  // test that we are getting desired data
  setTimeout(() => {
    console.log(newContainer);
  }, 2000);


  // const data = queryUsers.find();
  // console.log(data);

  // development note: here is assumed middleware did what it was suppose to
  return request.account.pCreateToken()
    .then((token) => {
      logger.log(logger.INFO, 'Res 200 Status & Token');
      return response.json({ token });
    })
    .catch(next);
});
