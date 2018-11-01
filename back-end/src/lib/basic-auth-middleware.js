'use strict';

const HttpError = require('http-errors');
const Account = require('../model/auth-account-schema');

const invalidMsg = 'AUTH - invalid request';

module.exports = (request, response, next) => {
  // check for headers
  if (!request.headers.authorization) {
    return next(new HttpError(400, invalidMsg));
  }
  // if we have the right headers... parse them
  const base64Header = request.headers.authorization.split('Basic ')[1];

  if (!base64Header) {
    return next(new HttpError(400, invalidMsg));
  }

  const stringAuthHeader = Buffer.from(base64Header, 'base64').toString();
  // stringAuthHeader should resumble format of: 'username:password'

  const [username, password] = stringAuthHeader.split(':');

  if (!username || !password) {
    return next(new HttpError(400, invalidMsg));
  }

  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, invalidMsg));
      }
      return account.pVerifyPassword(password);
    })
    .then((matchedAccount) => {
      request.account = matchedAccount;
      return next();
    })
    .catch(next);
};
