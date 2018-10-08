'use strict';

const faker = require('faker');
const userMock = require('./user-mock');
const BlogPost = require('../../model/blog-post-schema');

const blogPostMock = {};

blogPostMock.pCreateBlogPostMock = () => {
  const resultMock = {};
  return userMock.pCreateUserMock()
    .then((createdUserMock) => {
      resultMock.category = createdUserMock;

      return new BlogPost({
        title: faker.lorem.words(5),
        content: faker.lorem.words(5),
        user: createdUserMock._id,
      }).save();
    })
    .then((createdBlogPostMock) => {
      resultMock.blogPost = createdBlogPostMock;
      return resultMock;
    });
};

blogPostMock.pCleanBlogPostMocks = () => {
  return Promise.all([
    BlogPost.remove({}),
    userMock.pCleanUserMocks(),
  ]);
};

module.exports = blogPostMock;
