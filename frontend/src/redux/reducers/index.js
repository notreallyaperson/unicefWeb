import { combineReducers } from 'redux';

//Import Reducers
import authReducer from './authReducer'
import errorReducer from './errorReducer'
import userReducer from './userReducer'
import articleReducer from './articleReducer'
import rssFeedReducer from './rssFeedReducer'

const reducers = combineReducers({
    authReducer,
    errorReducer,
    userReducer,
    articleReducer,
    rssFeedReducer,
});

export default reducers;
