'use strict';

const faker = require('faker');
const userMock = require('./user-mock');
const BlogPost = require('../../model/user-blog-post-schema');

const userBlogPostMock = {};

userBlogPostMock.pCreateUserBlogPostMock = () => {
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

userBlogPostMock.pCleanUserBlogPostMocks = () => {
  return Promise.all([
    BlogPost.remove({}),
    userMock.pCleanUserMocks(),
  ]);
};

module.exports = userBlogPostMock;
