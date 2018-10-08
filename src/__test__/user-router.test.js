'use strict';

// development note: - see test.env.js for environment includes

const superagent = require('superagent');
const server = require('../lib/server');
const userMockObject = require('./lib/user-mock');

describe('testing app.js routes and responses.', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(userMockObject.pCleanUserMocks);

  test('should respond 200 and return a new user in json.', () => {
    return superagent.post(`http://localhost:${process.env.PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send({
        username: 'bgwest88',
        title: 'Sysadmin / Junior Developer',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.username).toEqual('bgwest88');
        expect(response.body.title).toEqual('Sysadmin / Junior Developer');
        expect(response.body.timestamp).toBeTruthy();
        expect(response.body._id.toString()).toBeTruthy();
      });
  });
  test('Attempting to POST with no content to send. Should receive 400.', () => {
    return superagent.post(`http://localhost:${process.env.PORT}/new/user`)
      .set('Content-Type', 'application/json')
      .send({})
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('if there is a matching id, should respond with 200 && json a note.', () => {
    let savedUserMock = null;
    return userMockObject.pCreateUserMock()
      .then((createdMockUser) => {
        savedUserMock = createdMockUser;
        return superagent.get(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedUserMock._id.toString());
        expect(getResponse.body.title).toEqual(savedUserMock.title);
      });
  });
  test('attempt to get valid request with an invalid id and should receive 404.', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/login/invalid-id-au8290aoop1039j`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
  test('testing PUT method. should return updated body && 200 status.', () => {
    let savedUserMock = null;
    return userMockObject.pCreateUserMock()
      .then((createdMockUser) => {
        savedUserMock = createdMockUser;
        return superagent.put(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`)
          .set('Content-Type', 'application/json')
          .send('{"username":"testuser","title":"nobody"}');
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedUserMock._id.toString());
        expect(getResponse.body.title).toEqual('nobody');
        expect(getResponse.body.username).toEqual('testuser');
      });
  });
  test('testing PUT method in the case where no body content is provided - should return 400.', () => {
    return userMockObject.pCreateUserMock()
      .then((createdMockUser) => {
        return superagent.put(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`)
          .then(Promise.reject)
          .catch((response) => {
            expect(response.status).toEqual(404);
          });
      });
  });
  test('attempting user creation and then deletion - successful delete should return 201', () => {
    return userMockObject.pCreateUserMock()
      .then((createdMockUser) => {
        // console.log(createdMockUser);
        // development note: needed to slow down the return wait for db to create it
        setTimeout(() => {
          return superagent.delete(`http://localhost:${process.env.PORT}/login/${createdMockUser._id}`)
            .then((getResponse) => {
              expect(getResponse.status).toEqual(201);
            });
        }, 1000);
      });
  });
  test('attempt to delete with bad ID - should return 404', () => {
    return superagent.delete(`http://localhost:${process.env.PORT}/login/hooo-boy-this-id-invalid`)
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
      });
  });
});
