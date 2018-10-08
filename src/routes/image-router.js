'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const multer = require('multer');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();

const Image = require('../model/image-schema');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const upload = multer({ dest: `${__dirname}/../temp` });
const s3 = require('../lib/s3');

const router = module.exports = new express.Router();


router.post('/image/upload', bearerAuthMiddleware, upload.any(), jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  // sprinkle some validation
  if (!request.body.title || request.files.length > 1) {
    return next(new HttpError(400, 'bad request'));
  }
  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;
  // un-comment consoles for debugging
  // console.log(request.account._id);
  // console.log(request.body.title);
  // console.log(file);
  // console.log(key);

  return s3.pUpload(file.path, key)
  // going to s3.pUpload to do it's thing and come back
    .then((s3URL) => {
      return new Image({
        title: request.body.title,
        url: s3URL,
        account: request.account._id,
      }).save();
    })
    .then((image) => {
      logger.log(logger.INFO, 'Responding with 200');
      console.log(image);
      return response.json(image);
    })
    .catch(next);
});


router.delete('/image/upload/:id', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }

  const saveId = request.params.id; // aka the url
  let saveUrl = null; // container for url
  let index = null; // get end of url array - aka the file name

  return Image.findById(saveId)
    .then((image) => {
      if (!image) {
        logger.log(logger.INFO, 'Responding with a 404 status code');
        return next(new HttpError(404, 'could not find image to delete'));
      }
      saveUrl = image.url;
      saveUrl = saveUrl.split('/');
      index = saveUrl.length - 1;
      console.log(saveUrl);
      return image.remove();
    })
    .then(() => {
      console.log(saveUrl);
      return s3.pRemove(saveUrl[index]);
    })
    .then(() => {
      return response.sendStatus(204);
    })
    .catch(error => next(error));
});

// router.get('/image/upload/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
//   // test if bearer auth account was passed, if not reject image request attempt
//   if (!request.account) {
//     return next(new HttpError(400), 'not authorized.');
//   }
//   logger.log(logger.INFO, 'GET - /image/upload/([$id])');
//   logger.log(logger.INFO, `Trying: ${request.params.id}`);
//   return Image.findById(request.params.id)
//   // mongoose resolves whether or not it can find this ID
//     .then((image) => {
//       if (image) {
//         logger.log(logger.INFO, '200 - image found.');
//         return response.json(image);
//       }
//       logger.log(logger.INFO, '404 - Image not found.');
//       return next(new HttpError(404, 'Image not found.'));
//     })
//     .catch(next); // development note: mongoose will only reject in case of error
//   // not finding an image is not considered an error
// });
//
// router.put('/image/upload/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
//   logger.log(logger.INFO, 'PUT image requested');
//   const toUpdate = {
//     title: request.body.title,
//     url: request.body.url,
//   };
//   if (toUpdate.title === undefined && toUpdate.url === undefined) {
//     return response.status(404).send('No data given. Updated request rejected.');
//   }
//   return Image.findByIdAndUpdate(request.params.id,
//     toUpdate, { new: true }, (error, putUpdate) => {
//       if (error) {
//         return response.status(401).send(error);
//       }
//       logger.log(logger.INFO, 'Image updated successful.');
//       return response.json(putUpdate);
//     })
//     .catch(next);
// });
//
