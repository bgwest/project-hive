import superagent from 'superagent';
import * as routes from '../routes';

//-------------------------------------------------------------
// SYNC
//-------------------------------------------------------------
export const set = token => ({
  type: 'TOKEN_SET',
  payload: token,
});

export const remove = () => ({
  type: 'TOKEN_REMOVE',
});

export const notUnique = () => ({
  type: 'NOT_UNIQUE',
  payload: notUnique,
});

//-------------------------------------------------------------
// ASYNC
//-------------------------------------------------------------
// !: because actions are curried, store is going to be the last argument
//    to be applied.
//    user is applied by the developer when calling the action
//    store is applied by thunk
export const signupRequest = user => (store) => {
  // need to convert to string for mongoDB schema requirement
  user.accesscode = user.accesscode.toString();
  //! 2
  return superagent.post(`${API_URL}${routes.SIGNUP_BACKEND}`) // eslint-disable-line
    .send(user)
    // .withCredentials() // !: for cookies -- no cookies, using cors in node
    .then((response) => { //! 3
      // !: set is a SYNC action, therefore; it connects and updates the store
      return store.dispatch(set(response.text)); // !4
    });
};

export const loginRequest = user => (store) => {
  return superagent.get(`${API_URL}${routes.LOGIN_BACKEND}`) // eslint-disable-line
    .auth(user.username, user.password)
    // .withCredentials() // !: for cookies -- no cookies, using cors in node
    .then((response) => { //! 3
      // !: set is a SYNC action, therefore; it connects and updates the store
      return store.dispatch(set(response.text)); // !4
    });
};

export const uniqueHandling = account => (store) => {
  return superagent.get(`${API_URL}${routes.SIGNUP_VALIDATION_BACKEND}/${account.username}/${account.email}`) // eslint-disable-line
  // .withCredentials() // !: for cookies -- no cookies, using cors in node
    .then((response) => { //! 3
      const convertedResponse = JSON.parse(response.text);
      // !: set is a SYNC action, therefore; it connects and updates the store
      store.dispatch(notUnique(convertedResponse)); // !4
      return convertedResponse;
    }).then((data) => {
      return data;
    });
};
