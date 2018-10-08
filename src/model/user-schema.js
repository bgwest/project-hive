'use strict';

const mongoose = require('mongoose');

function generateAccessCode() {
  let accessCode = '';
  const maxLength = 4;

  for (let generateNumber = 0; generateNumber <= maxLength - 1; generateNumber++) {
    accessCode += `${Math.round(Math.random() * 9)}`;
  }
  return accessCode;
}

const UserSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 3, // this is to force at least a 3 letter abrev or encourage a description
  },
  accesscode: {
    type: String,
    code: () => generateAccessCode(),
  },
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'image-schema', // name of model in mongoose.model export
    },
  ],
},
{ // hard to find documentation on usePushEach
  usePushEach: true,
});

module.exports = mongoose.model('user-schema', UserSchema);
