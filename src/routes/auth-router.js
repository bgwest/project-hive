'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Account = require('../model/auth-account-schema');
const logger = require('../lib/logger');
const basicAuthMiddleWare = require('../lib/basic-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/user/signup', jsonParser, (request, response, next) => {
  if (!request.body.password) {
    return next(new HttpError(400, 'missing parameters'));
  }
  return Account.create(request.body.username, request.body.email,
    request.body.password) // 1. Hash password
    .then((createdAccount) => {
      delete request.body.password;
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
