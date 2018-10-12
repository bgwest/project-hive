'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const bcrypt = require('bcrypt');
const logger = require('../lib/logger');

// imports arm and disarm functions
const AlarmControls = require('../lib/alarm-system');
// allows us to call the armSystem and disarmSystem functions
// using alarmControl.armSystem or alarmControl.disarmSystem
const alarmControl = new AlarmControls();

const AuthAccount = require('../model/auth-account-schema');
const queryData = require('../lib/queryData');

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


const verifyAccessCode = (plainTextPassword, hashValue, callback) => {
  bcrypt.compare(plainTextPassword, hashValue, function (error, result) { //eslint-disable-line
    if (!result) {
      callback(null, result);
    }
    if (result) {
      accessCodeResult = true;
      callback(null, result);
    }
  });
};

const masterAccessValidation = (passedAccess, request, response, next) => {
  // define query for AuthAccount
  const findStuff = queryData.find(AuthAccount, 'accessCodeHash');
  let accessCodes = {};
  // fill query container with AuthAccount data
  queryData.query(findStuff, function (data, error) { //eslint-disable-line
    if (error) {
      return next(new HttpError(400, 'query error.'));
    }
    if (data) {
      accessCodes = data;
      // convert accessCodes into iterable array
      accessCodes = Object.values(accessCodes);
      for (let queryLength = 0; queryLength <= accessCodes.length - 1; queryLength++) {
        const checkHash = accessCodes[`${queryLength}`].accessCodeHash;
        verifyAccessCode(passedAccess, checkHash, function (err, test) { //eslint-disable-line
          if (err) {
            return next(new HttpError(400, 'accessCode error consult system admin.'));
          }
          if (test) {
            if (accessCodeResult === true) {
              // loop will keep checking until it's complete asynchronously... but...
              // as soon as it finds a match this is the only thread that will continue on in logic
              queryLength = accessCodes.length - 1;
              // get sent path
              const getPath = request.url.split('/')[1];

              if (getPath === 'arm') {
                // console.log('\nRun jason and kris\'s code for arm.\n');
                alarmControl.armSystem();
              }
              if (getPath === 'disarm') {
                // console.log('\nRun jason and kris\'s code for disarm.\n');
                alarmControl.disarmSystem();
              }
              if (getPath !== 'disarm' && getPath !== 'arm') {
                return next(new HttpError(400, 'something went wrong. consult your admin.'));
              }
              return response.json({ message: 'verified', accesscode: passedAccess, isValid: accessCodeResult });
            }
          }
          if (accessCodeResult !== true && queryLength === accessCodes.length - 1) {
            console.log('\nNo code runs...\n');
            return response.json({ message: 'bad access code', accesscode: passedAccess, isValid: accessCodeResult });
          }
          return undefined;
        });
        if (accessCodeResult) {
          break;
        }
      }
    }
    return undefined;
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
  // else, store access code and delete param
  const passedAccess = request.params.id;
  delete request.params.id;

  // hash incoming access code for compare
  const accessCodeHash = hashAccessCode(passedAccess, getHashCode);
  if (!accessCodeHash) {
    logger.log(logger.INFO, 'passcode failed hash failed.');
    return next(new HttpError(400, 'failed hash.'));
  }

  masterAccessValidation(passedAccess, request, response, next);
  return undefined;
});

router.get('/disarm/:id', jsonParser, (request, response, next) => {
  console.log(request.url);
  // ensure accessCodeResult is reset each time
  accessCodeResult = false;
  logger.log(logger.INFO, `Checking id for disarm: ${request.params.id}`);
  if (!request.params.id) {
    logger.log(logger.INFO, 'no access code given.');
    return next(new HttpError(400, 'missing parameters'));
  }
  // else, store access code and delete param
  const passedAccess = request.params.id;
  delete request.params.id;

  // hash incoming access code for compare
  const accessCodeHash = hashAccessCode(passedAccess, getHashCode);
  if (!accessCodeHash) {
    logger.log(logger.INFO, 'passcode failed hash failed.');
    return next(new HttpError(400, 'failed hash.'));
  }
  masterAccessValidation(passedAccess, request, response, next);
  return undefined;
});
