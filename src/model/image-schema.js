'use strict';

const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
    // unique: true,
    // development note:
    //   This would mean that there can only be one image
    //   with the same name in the application.
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // unique: true,
    // development note:
    //   this would mean that a user can have ONLY one image
  },
});

module.exports = mongoose.model('image', imageSchema);
