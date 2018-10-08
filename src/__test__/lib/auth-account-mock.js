'use strict';

const faker = require('faker');
const AuthAccount = require('../../model/auth-account-schema');

const accountMock = module.exports = {};

function generateAccessCode() {
  let accessCode = '';
  const maxLength = 4;

  for (let generateNumber = 0; generateNumber <= maxLength - 1; generateNumber++) {
    accessCode += `${Math.round(Math.random() * 9)}`;
  }
  return accessCode;
}

accountMock.pCreateMock = () => {
  const mock = {};
  mock.request = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    accesscode: generateAccessCode(),
  };

  return AuthAccount.create(mock.request.username,
    mock.request.email,
    mock.request.password,
    mock.request.accesscode)
    .then((createdAccount) => {
      mock.account = createdAccount;
      return createdAccount.pCreateToken();
    })
    .then((token) => {
      mock.token = token;
      return mock;
    })
    .catch((error) => {
      console.error(error);
    });
};

accountMock.pCleanAuthAccountMocks = () => AuthAccount.remove({});
