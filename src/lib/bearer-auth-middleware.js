'use strict';

const HttpError = require('http-errors');
const jsonWebToken = require('jsonwebtoken');
const Account = require('../model/auth-account-schema');

/**
 *
 * @param callbackStyleFunction
 * @param args - any arguments we need to pass to callBackStyleFunction
 * @returns
 */
const promisify = callbackStyleFunction => (...args) => {
  return new Promise((resolve, reject) => {
    callbackStyleFunction(...args, (error, data) => {
      if (error) {
        return reject(error); // can now chain a .catch
      }
      return resolve(data); // can now chain a .then
    });
  });
};


module.exports = (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(401, 'Not authorized.'));
  }

  const token = request.headers.authorization.split('Bearer ')[1];

  if (!token) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  return promisify(jsonWebToken.verify)(token, process.env.APP_SECRET)
    .then((decryptedToken) => {
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request'));
      }
      request.account = account; // development note: here account is authorized to use the route
      return next();
    })
    .catch(next);
};
