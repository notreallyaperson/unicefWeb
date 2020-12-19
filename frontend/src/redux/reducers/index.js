import { combineReducers } from 'redux';

//Import Reducers
import authReducer from './authReducer'
import errorReducer from './errorReducer'
import userReducer from './userReducer'

const reducers = combineReducers({
    authReducer,
    errorReducer,
    userReducer,
});

export default reducers;
