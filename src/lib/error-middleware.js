'use strict';

const logger = require('./logger');

module.exports = (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE');
  logger.log(logger.ERROR, error);

  if (error.status) {
    logger.log(logger.ERROR, `Responding with a ${error.status} code and a message of ${error.message}`);
    return response.sendStatus(error.status);
  }
  // ----------------------------------------------------------
  // SPECIFIC ERROR CODES
  // ----------------------------------------------------------
  const errorMessage = error.message.toLowerCase(); // O(n)

  if (errorMessage.includes('failed for value')) { // (n)
    logger.log(logger.ERROR, 'Responding with a 404 code.');
    logger.log(logger.ERROR, 'bad URI given for delete.');
    return response.sendStatus(404);
  }

  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.ERROR, 'unauthorized');
    return response.sendStatus(401);
  }

  if (errorMessage.includes('not found')) {
    logger.log(logger.ERROR, 'Responding with a 404 code.');
    logger.log(logger.ERROR, 'Bad route.');
    return response.sendStatus(404);
  }

  if (errorMessage.includes('objectid failed')) { // (n)
    logger.log(logger.ERROR, 'Responding with a 404 code.');
    logger.log(logger.ERROR, 'could not validate id');
    return response.sendStatus(404);
  }

  if (errorMessage.includes('validation failed')) {
    logger.log(logger.ERROR, 'Responding with a 400 code.');
    logger.log(logger.ERROR, 'validation failed');
    return response.sendStatus(400);
  }

  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.ERROR, 'Responding with a 409 code.');
    logger.log(logger.ERROR, 'duplicate value');
    return response.sendStatus(409);
  }
  // ----------------------------------------------------------
  logger.log(logger.ERROR, 'Responding with a 500 error code');
  return response.sendStatus(500);
};
