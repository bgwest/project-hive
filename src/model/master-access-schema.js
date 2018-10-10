'use strict';

const mongoose = require('mongoose');

// Master Access Schema
const MAS = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  masterCodes: [
    {
      type: String,
    },
  ],
});

const MasterAccountSchema = module.exports = mongoose.model('mas', MAS); // eslint-disable-line

// Create Initial Master List Schema
// function createInitialMLS() {
//   return new MasterAccountSchema({ masterCodes: [] }).save()
//     .then((savedMAS) => {
//       console.log(savedMAS);
//     });
// }
//
// createInitialMLS();
