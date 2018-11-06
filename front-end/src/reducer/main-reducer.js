import { combineReducers } from 'redux';
import token from './token-reducer';
import status from './status-reducer';

export default combineReducers({ token, status });
