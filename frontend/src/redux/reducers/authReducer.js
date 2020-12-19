import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    RESET_SUCCESS,
    RESET_FAIL,
    AUTH_LOADING,
    CREATE_PASSWORD,
} from '../types';

function initialState() {
    return {
        token: localStorage.getItem('token'),
        PHPSESSID: localStorage.getItem('PHPSESSID'),
        isAuthenticated: false,
        isLoading: true,
        authLoading: true, //For LOGIN AUTHENTICATION
        user: null,
        message: null,
        redirect: false,
        users: [], // getting all users
    };
}

const authReducer = function (state = initialState(), action) {
    switch (action.type) {
        case AUTH_LOADING:
            return {
                ...state,
                authLoading: true
            }
        case USER_LOADING:
            return {
                ...state,
                isLoading: true,
            };
        case USER_LOADED:
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('PHPSESSID', action.payload.PHPSESSID);
            }
            return {
                ...state,
                token: action.payload.token ? action.payload.token : state.token,
                PHPSESSID: action.payload.PHPSESSID ? action.payload.PHPSESSID : state.PHPSESSID,
                user: action.payload,
                isAuthenticated: true,
                authLoading: false,
                isLoading: false,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case REGISTER_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.removeItem('token');
            localStorage.removeItem('PHPSESSID');

            return {
                ...state,
                token: null,
                PHPSESSID: null,
                isAuthenticated: false,
                authLoading: false,
                isLoading: false,
                user: null,
            };
        case CREATE_PASSWORD:
            return {
                ...state,
                isLoading: false,
                message: action.payload.message
            }
        case RESET_SUCCESS:
            return {
                ...state,
                redirect: true,
                isLoading: false,
            };
        case RESET_FAIL:
            return {
                ...state,
                redirect: false,
                isLoading: false,
                message: null
            };
        default:
            return state;
    }
};

export default authReducer;
