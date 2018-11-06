import superagent from 'superagent';
import * as routes from '../routes';

export const set = status => ({
  type: 'STATUS_SET',
  payload: status,
});

export const armSystem = accesscode => (store) => {
  console.log('armSystem called');
  console.log(accesscode.accessCode);
  return superagent.get(`${API_URL}${routes.ARM_BACKEND}/${accesscode.accessCode}`) // eslint-disable-line
  // .withCredentials() // !: for cookies -- no cookies, using cors in node
    .then((response) => { //! 3
      // !: set is a SYNC action, therefore; it connects and updates the store
      return store.dispatch(set(response.text)); // !4
    });
};

export const disarmSystem = accesscode => (store) => {
  console.log('disarmSystem called');
  console.log(accesscode.accessCode);
  return superagent.get(`${API_URL}${routes.DISARM_BACKEND}/${accesscode.accessCode}`) // eslint-disable-line
  // .withCredentials() // !: for cookies -- no cookies, using cors in node
    .then((response) => { //! 3
      // !: set is a SYNC action, therefore; it connects and updates the store
      return store.dispatch(set(response.text)); // !4
    });
};
