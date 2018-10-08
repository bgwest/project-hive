'use strict';

const faker = require('faker');
const UserModel = require('../../model/user-schema');

const userMock = module.exports = {};

// development note: p'Var' is a naming convention to know that the function will return promise
userMock.pCreateUserMock = () => {
  return new UserModel({
    username: faker.lorem.words(1),
    title: faker.lorem.words(2),
  }).save(); // development note: calling/using MONGO
};

userMock.pCleanUserMocks = () => {
  // development note: this line here ensures that the DB is wiped when we call it again
  return UserModel.remove({});
};
