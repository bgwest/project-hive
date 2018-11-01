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


  test('testing VALID accesscode on ARM route - should return isValid = true', () => {
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
  test('testing INVALID accesscode on ARM route - should return isValid = false', () => {
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
  test('testing VALID accesscode on DISARM route - should return isValid = true', () => {
    let savedMock = null; // eslint-disable-line
    return authMock.pCreateMock()
      .then((createdUserMock) => {
        savedMock = createdUserMock;
        return superagent.get(`${API_URL}/disarm/${authMock.testAccessCode}`);
      })
      .then((getResponse) => {
        expect(JSON.parse(getResponse.text).isValid).toBe(true);
      });
  });
  test('testing INVALID accesscode on DISARM route - should return isValid = false', () => {
    let savedMock = null; // eslint-disable-line
    return authMock.pCreateMock()
      .then((createdUserMock) => {
        savedMock = createdUserMock;
        return superagent.get(`${API_URL}/disarm/2223`);
      })
      .then((getResponse) => {
        expect(JSON.parse(getResponse.text).isValid).toBe(false);
      });
  });
});
