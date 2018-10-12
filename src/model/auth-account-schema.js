'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto'); // produces random bytes
const jsonWebToken = require('jsonwebtoken'); // actually doing the crypto
const bcrypt = require('bcrypt'); // this handles the hashing
const HttpError = require('http-errors');

// development note: can make larger if needed, development system using 8
const HASH_ROUNDS = 8;

function hashAccessCode(code, callback) {
  const bcryptReturn = bcrypt.hashSync(code, HASH_ROUNDS);
  return callback(bcryptReturn);
}

function getHashCode(hashCode) {
  return hashCode;
}

const accountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  accessCodeHash: {
    type: String,
    required: true,
    unique: true,
  },
});

const TOKEN_SEED_LENGTH = 128;

function pVerifyPassword(plainTextPassword) {
  // uses current account schema
  // e.g. .email, .tokenSeed, .passwordHash, .username, .accessCodeHash

  // behind the scenes, bcrypt is hashing
  return bcrypt.compare(plainTextPassword, this.passwordHash)
    .then((compareResult) => {
      if (!compareResult) {
        throw new HttpError(401, 'Unauthorized');
      }
      return this;
    })
    .catch((error) => {
      throw error;
    });
}

function pCreateToken() {
  // development notes:
  //   The value of this in this function is equal to the
  //   specific object we are working with...
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  //   Here, the token seed is a random, 'unique', long string
  return this.save()
    .then((savedAccount) => {
      // .sign, in this context, actually means encrypt
      return jsonWebToken.sign({
        tokenSeed: savedAccount.tokenSeed,
      }, process.env.APP_SECRET);
    })
    .catch((error) => {
      throw error;
    });
}

// development note: adding pCreateToken to the account's prototype
accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

const AuthAccount = module.exports = mongoose.model('account', accountSchema);

AuthAccount.create = (username, email, password, accesscode) => {
  const accessCodeHash = hashAccessCode(accesscode, getHashCode);
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; // eslint-disable-line no-param-reassign
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new AuthAccount({
        username,
        email,
        tokenSeed,
        passwordHash,
        accessCodeHash,
      }).save();
    });
};
