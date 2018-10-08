'use strict';

const faker = require('faker');
const superagent = require('superagent');
const mockAuthAccount = require('./lib/auth-account-mock');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}`;

describe('AUTH ROUTER', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(mockAuthAccount.pCleanAuthAccountMocks);

  test('test if 404 is returned if any route is invalid', () => {
    return superagent.get(`${API_URL}/fake/route`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('test if 200 is returned with a token on successful signup', () => {
    return superagent.post(`${API_URL}/user/signup`)
      .send({
        username: faker.lorem.words(1),
        password: faker.lorem.words(1),
        email: faker.internet.email(),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('test if a 400 is sent body data is missing (e.g. username)', () => {
    return superagent.post(`${API_URL}/user/signup`)
      .send({
        password: faker.lorem.words(1),
        email: faker.internet.email(),
      }).then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('test if a 400 is returned when no creation data is sent (no body)', () => {
    return superagent.post(`${API_URL}/user/signup`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('test if 200 and your token is returned on successful login', () => {
    return mockAuthAccount.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/user/auth/login`)
          .auth(mock.request.username, mock.request.password);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('test for 401 status if auth fails (aka bad pw or username)', () => {
    return mockAuthAccount.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/user/auth/login`)
          .auth(mock.request.username, 'bad-password');
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(401);
      });
  });
});
