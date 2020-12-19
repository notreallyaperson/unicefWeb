import axios from 'axios';

import {
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    RESET_SUCCESS,
    RESET_FAIL,
    USER_LOADING,
    AUTH_LOADING,
    CREATE_PASSWORD,
} from '../types';

import { returnErrors, clearErrors } from './errorActions'
import { baseURL } from '../helpers'


const setLoading = () => dispatch => {
    dispatch({
        type: AUTH_LOADING
    })
}

// Validate token and load user
export const loadUser = () => (dispatch, getState) => {
    axios
        .get(`${baseURL}/auth/user`, tokenConfig(getState))
        .then((res) =>
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            })
        )
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status, AUTH_ERROR));
            dispatch({
                type: AUTH_ERROR,
            });
        });
};

//Login User
//@route api/auth/login
// access public
export const login = ({ email, password }) => (dispatch) => {
    dispatch(setLoading())
    dispatch(clearErrors())
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    //Request Body
    const body = JSON.stringify({
        email,
        password,
    });
    axios
        .post(`${baseURL}/auth/login`, body, config)
        .then((res) =>
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            })
        )
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status, LOGIN_FAIL));
            dispatch({
                type: LOGIN_FAIL,
            });
        });
};

//Logout User
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS,
    };
};

export const createPassword = requestBody => dispatch => {
    dispatch(setLoading())
    dispatch(clearErrors())
    axios.post(`${baseURL}/auth/create-password`, requestBody)
        .then(res => {
            dispatch({
                type: CREATE_PASSWORD,
                payload: res.data
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status, RESET_FAIL));
            dispatch({
                type: RESET_FAIL,
            });
        })
}

// Setup config/headers and token
export const tokenConfig = (getState) => {
    //Get token from local storage.. refer to authReducer under src/reducers/index.js
    const token = getState().authReducer.token;
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    //if there is a token then add it to the header
    if (token) {
        config.headers['x-auth-token'] = token;
    }

    return config;
};
