import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import mainReducer from './reducer/main-reducer';

import thunk from './middleware/redux-thunk';
import reduxReporter from './middleware/redux-reporter';

export default () => {
  const store = createStore(mainReducer,
    composeWithDevTools(applyMiddleware(reduxReporter, thunk)));
  return store;
};
