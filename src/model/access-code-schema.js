'use strict';

const mongoose = require('mongoose');
// const AuthAccount = require('./auth-account-schema');
// const HttpError = require('http-errors');

// accessCodeMLS = Access Code Master List Schema
const accessCodeSchema = mongoose.Schema({
  accessCode: {
    type: String,
    required: true,
    unique: true,
  },
  mas: { // development note: this is where we are making the connection to MAS
    type: mongoose.Schema.Types.ObjectId,
    required: true, // we need to have a one before we can create a many
    ref: 'mas', // name of model in mongoose.model export
  },
});

// development note: adding set methods to the MLS prototype
// accessCodeMLS.methods.pGetCurrentAccessCodes = pGetCurrentAccessCodes;

module.exports = mongoose.model('access-code', accessCodeSchema);
