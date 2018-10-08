'use strict';

const faker = require('faker');
const Image = require('../../model/image-schema');
const accountMock = require('./auth-account-mock');

const imageMock = module.exports = {};

imageMock.pCreateImageMock = () => {
  const resultMock = {};
  // development note:
  //   By the end, our mock will contain:
  //     - an account
  //     - a image
  return accountMock.pCreateMock()
    .then((mockedAccount) => {
      resultMock.account = mockedAccount;
      return new Image({
        title: faker.lorem.words(3),
        url: faker.internet.url(),
        account: mockedAccount.account._id,
      }).save();
    })
    .then((createdImage) => {
      resultMock.image = createdImage;
      return resultMock;
    });
};

imageMock.pCleanImageMock = () => {
  return Promise.all([
    Image.remove({}),
    accountMock.pCleanAuthAccountMocks(),
  ]);
};
