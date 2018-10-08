'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const ModelUser = require('../model/user-schema');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// home
router.get('/', (request, response) => {
  logger.log(logger.INFO, '200 - Welcome to the Jungle /');
  return response.status(200).send('<!DOCTYPE><html><header></header><body><div><p>cool beans.</p></div></body></html>');
});

// development note: used to create users
//   this can be seen as the final 'node' in the middleware linked list
router.post('/new/user', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'Attempting to create new user:');
  // console.log(request.body);
  return new ModelUser(request.body).save()
    .then((savedUser) => {
      logger.log(logger.INFO, 'Responding with 200');
      return response.json(savedUser);
    })
    .catch(next);
});

router.get('/login/:id', (request, response, next) => {
  logger.log(logger.INFO, 'GET - /login/([$id])');
  logger.log(logger.INFO, `Trying: ${request.params.id}`);
  return ModelUser.findById(request.params.id)
  // mongoose resolves whether or not it can find this ID
    .then((user) => {
      if (user) {
        logger.log(logger.INFO, '200 - user found.');
        return response.json(user);
      }
      logger.log(logger.INFO, '404 - User not found.');
      return next(new HttpError(404, 'user not found.'));
    })
    .catch(next); // development note: mongoose will only reject in case of error
  // not finding a user is not considered an error
});

router.put('/login/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'PUT requested');
  const toUpdate = {
    username: request.body.username,
    title: request.body.title,
  };
  if (toUpdate.username === undefined && toUpdate.title === undefined) {
    return response.status(404).send('No data given. Updated request rejected.');
  }
  return ModelUser.findByIdAndUpdate(request.params.id,
    toUpdate, { new: true }, (error, putUpdate) => {
      if (error) {
        return response.status(401).send(error);
      }
      logger.log(logger.INFO, 'Update successful.');
      return response.json(putUpdate);
    })
    .catch(next);
});

router.delete('/login/:id', (request, response, next) => {
  logger.log(logger.INFO, 'DELETE - /login/([$id])');
  logger.log(logger.INFO, `Attempting delete on: ${request.params.id}`);
  //! development note:
  //   delete is true always true if object exists... be careful
  return ModelUser.findByIdAndRemove(`blogPosts.${request.params.id}`, (error, deleteUser) => {
    if (error) {
      return next(new HttpError(404, 'invalid user _id sent.'));
    }
    return response.status(201).send({ message: 'User deleted successfully', id: deleteUser._id });
  })
    .catch(next);
});
