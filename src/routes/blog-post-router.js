'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const BlogPost = require('../model/blog-post-schema');
// const UserModel = require('../model/user-schema');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// create a new blog post associated with passed user _id
router.post('/user/blog-posts', jsonParser, (request, response, next) => {
  return new BlogPost(request.body).save()
    .then((savedBlogPost) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      response.json(savedBlogPost);
    })
    .catch(error => next(error));
});

// update specified blog-post by _id
router.put('/user/blog-posts/:id', jsonParser, (request, response, next) => {
  const updateOptions = {
    runValidators: true,
    new: true,
  };
  return BlogPost.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then((updatedBlogPost) => {
      if (!updatedBlogPost) {
        logger.log(logger.INFO, 'Responding with a 404 status code');
        return next(new HttpError(404, 'could not find blog post to update'));
      }
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(updatedBlogPost);
    })
    .catch(error => next(error));
});

// retrieve specified blog post by blog-post _id
router.get('/user/blog-posts/:id', jsonParser, (request, response, next) => {
  return BlogPost.findById(request.params.id).populate('blog-post-schemas')
    .then((blogPost) => {
      if (!blogPost) {
        logger.log(logger.INFO, 'Responding with 404 status');
        return next(new HttpError(404, 'could not find blog post associated with user'));
      }
      logger.log(logger.INFO, 'Responding with 200 status');
      return response.json(blogPost);
    })
    .catch(error => next(error));
});

router.delete('/user/blog-posts/:id', jsonParser, (request, response, next) => {
  // let savedBlogPost = null;
  logger.log(logger.INFO, `DELETE - /user/blog-posts/${request.params.id}`);
  logger.log(logger.INFO, `Attempting delete on: ${request.params.id}`);
  // let tempBlogPost = null;
  // development note: delete is always true if object exists... be careful
  return BlogPost.findByIdAndRemove(request.params.id)
    .then((deleteBlogPost) => {
      // tempBlogPost = deleteBlogPost;
      if (!deleteBlogPost) {
        return next(new HttpError(404, 'invalid blog-post _id sent.'));
      }
      return response.status(201).send({ message: 'Blog Post deleted', id: deleteBlogPost.id });
      // return response.json(deleteBlogPost);
    })
    // .then(() => {
    //   return BlogPost.remove(tempBlogPost);
    // })
    .catch(next);
});
