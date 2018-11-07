import { combineReducers } from 'redux';
import token from './token-reducer';
import status from './status-reducer';
import notUnique from './validation-reducer';

export default combineReducers({ token, status, notUnique });
