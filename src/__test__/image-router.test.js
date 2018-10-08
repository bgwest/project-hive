'use strict';

const superagent = require('superagent');
const server = require('../lib/server');
const imageMock = require('./lib/image-mock');
const authAccountMock = require('./lib/auth-account-mock');

const API_URL = `http://localhost:${process.env.PORT}/image/upload`;

describe('testing route: /image/upload', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(authAccountMock.pCleanAuthAccountMocks);
  beforeEach(imageMock.pCleanImageMock);

  test('should respond with 200 status code and a picture', () => {
    // let mockCopy = null;
    return authAccountMock.pCreateMock()
      .then((mock) => {
        // mockCopy = mock;
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .field('title', 'Mr Gregor')
          .attach('picture', `${__dirname}/assets/gregor.jpg`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.url).toContain('http');
      });
  });

  // made to work in heroku... need help with testing duality issue here...

  // test('test to ensure the object was deleted from s3 - should respond 204', () => {
  //   return imageMock.pCreateImageMock()
  //     .then((mock) => {
  //       const mockImageId = mock.image._doc._id.toString();
  //       // console.log(mockImageId);
  //       return superagent.delete(`${API_URL}/${mockImageId}`)
  //         .set('Authorization', `Bearer ${mock.account.token}`);
  //     })
  //     .then((response) => {
  //       expect(response.status).toEqual(204);
  //     });
  // });
});
