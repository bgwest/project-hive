'use strict';

const mongoose = require('mongoose');

// Master Access Schema
const MAS = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  masterCodes: {
    type: [],
  },
});

const MasterAccountSchema = module.exports = mongoose.model('mas', MAS);

MasterAccountSchema.create = (masterCodes) => {
  return new MAS({
    masterCodes,
  });
};
