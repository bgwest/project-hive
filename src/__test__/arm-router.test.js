'use strict';

// development note: - see test.env.js for environment includes

const superagent = require('superagent');
const server = require('../lib/server');
const authMock = require('./lib/auth-account-mock');

const API_URL = `http://localhost:${process.env.PORT}`;


describe('', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(authMock.pCleanAuthAccountMocks);


  test('testing accesscode on arm route', () => {
    let savedMock = null; // eslint-disable-line
    return authMock.pCreateMock()
      .then((createdUserMock) => {
        savedMock = createdUserMock;
        return superagent.get(`${API_URL}/arm/${authMock.testAccessCode}`);
      })
      .then((getResponse) => {
        expect(JSON.parse(getResponse.text).isValid).toBe(true);
      });
  });
  test('testing accesscode a bad code and return false', () => {
    let savedMock = null; // eslint-disable-line
    return authMock.pCreateMock()
      .then((createdUserMock) => {
        savedMock = createdUserMock;
        return superagent.get(`${API_URL}/arm/2223`);
      })
      .then((getResponse) => {
        expect(JSON.parse(getResponse.text).isValid).toBe(false);
      });
  });
});
