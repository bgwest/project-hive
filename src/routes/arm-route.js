'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const bcrypt = require('bcrypt');
const logger = require('../lib/logger');

// const MAS = require('../model/master-access-schema');
const AuthAccount = require('../model/auth-account-schema');
const queryUsers = require('../lib/queryUsers');

const jsonParser = bodyParser.json();
// this handles the hashing
const router = module.exports = new express.Router();

// development note: can make larger if needed, development system using 8
const HASH_ROUNDS = 8;
let accessCodeResult = false;

function hashAccessCode(code, callback) {
  const bcryptReturn = bcrypt.hashSync(code, HASH_ROUNDS);
  return callback(bcryptReturn);
}

function getHashCode(hashCode) {
  return hashCode;
}

const verifyAccessCode = (plainTextPassword, hashValue) => {
  // uses current account schema
  // e.g. .email, .tokenSeed, .passwordHash, .username, .accessCodeHash

  // behind the scenes, bcrypt is hashing
  console.log('verifyAccessCode called');
  return bcrypt.compare(plainTextPassword, hashValue)
    .then((compareResult) => {
      if (!compareResult) {
        console.log('unmatched result:');
        console.log(compareResult);
        return false;
      }
      if (compareResult) {
        console.log('matched result:');
        console.log(compareResult);
        accessCodeResult = true;
        return accessCodeResult;
      }
      return undefined;
    })
    .catch((error) => {
      throw error;
    });
};

router.get('/arm/:id', jsonParser, (request, response, next) => {
  // ensure accessCodeResult is reset each time
  accessCodeResult = false;
  logger.log(logger.INFO, `Checking id for arm: ${request.params.id}`);
  if (!request.params.id) {
    logger.log(logger.INFO, 'no access code given.');
    return next(new HttpError(400, 'missing parameters'));
  }
  // hash incoming access code for compare
  const accessCodeHash = hashAccessCode(request.params.id, getHashCode);
  if (!accessCodeHash) {
    logger.log(logger.INFO, 'passcode failed hash failed.');
  }

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
  const findStuff = queryUsers.find(AuthAccount, 'accessCodeHash');
  let accessCodes = {};
  // fill query container with AuthAccount data
  queryUsers.query(findStuff, (data) => {
    accessCodes = data;
    return data;
  });
  // test that we are getting desired data
  setTimeout(() => {
    // console.log(Object.values(accessCodes).length);
    accessCodes = Object.values(accessCodes);
    for (let queryLength = 0; queryLength <= accessCodes.length - 1; queryLength++) {
      const checkHash = accessCodes[`${queryLength}`].accessCodeHash;
      console.log(checkHash);
      verifyAccessCode(request.params.id, checkHash);
    }
    console.log('accessCodeResult:');
    console.log(accessCodeResult);
  }, 1000);
  setTimeout(() => {
    if (accessCodeResult) {
      console.log('\nRun jason and kris\'s code\n');
      return response.json({ message: 'verified', accesscode: request.params.id, isValid: accessCodeResult });
    }
    console.log('\nNo code runs...\n');
    return response.json({ message: 'bad access code', accesscode: request.params.id, isValid: accessCodeResult });
  }, 2000);
  return undefined;
});
