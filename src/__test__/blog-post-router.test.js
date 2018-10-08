'use strict';

// development note: - see test.env.js for environment includes

const superagent = require('superagent');
const server = require('../lib/server');
const blogPostMock = require('./lib/blog-post-mock');
const userMockObject = require('./lib/user-mock');

// const savedUserMock = userMockObject.pCreateUserMock;
// console.log(savedUserMock);

const API_URL = `http://localhost:${process.env.PORT}/user/blog-posts`;

describe('testing /user/blog-posts', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(blogPostMock.pCleanBlogPostMocks);

  test('creating mock blogPost with mock user, using super agent for PUT update, and response should be 200 status.', () => {
    let savedMock = null;
    return blogPostMock.pCreateBlogPostMock()
      .then((mock) => {
        savedMock = mock;
        return superagent.put(`${API_URL}/${mock.blogPost._id}`)
          .send({
            title: 'I am a new and updated title',
            content: 'updating content',
          });
      }) // development note: this mock object has two things... a category and a blog post
      .then((response) => {
        expect(response.status).toEqual(200);
        // expect(response.body.content).toEqual(savedMock.blogPost._doc.content);
        expect(response.body.content).toEqual('updating content');
        expect(response.body.title).toEqual('I am a new and updated title');
        expect(response.body.user.toString()).toEqual(savedMock.blogPost._doc.user.toString());
      });
  });
  test('create a mock blog post and try to get that post be sending it\'s id', () => {
    let savedMock = null;
    return blogPostMock.pCreateBlogPostMock()
      .then((mock) => {
        savedMock = mock;
        return superagent.get(`${API_URL}/${mock.blogPost._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body._id).toEqual(savedMock.blogPost._doc._id.toString());
        expect(response.body.content).toEqual(savedMock.blogPost._doc.content);
      });
  });
  test('create a mock user and send it a blog post', () => {
    let savedUser = null;
    return userMockObject.pCreateUserMock()
      .then((userMock) => {
        savedUser = userMock;
        return superagent.post(`${API_URL}`)
          .send({
            title: 'this is my #1 blog post!',
            user: savedUser._id,
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual('this is my #1 blog post!');
      });
  });
  test('creating mock blog post / user and then deleting it.', () => {
    let savedBlogMock = null;
    return blogPostMock.pCreateBlogPostMock()
      .then((blogMock) => {
        savedBlogMock = blogMock;
        return superagent.delete(`${API_URL}/${blogMock.blogPost._id}`);
      })
      .then((response) => {
        expect(response.body.id.toString()).toEqual(savedBlogMock.blogPost._doc._id.toString());
        expect(response.status).toEqual(201);
      });
  });
});
