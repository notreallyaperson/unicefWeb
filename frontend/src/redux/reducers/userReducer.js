import { USER_FAIL, GET_USERS, ADD_USER, DELETE_USER, UPDATE_USER, SET_USER_UPDATED, GET_USER, SET_USER } from '../types';

function initialState() {
    return {
        users: [],
        user: null,
        updated: false,
    };
}

const userReducer = function (state = initialState(), action) {
    const { type, payload } = action
    switch (type) {
        case GET_USERS:
            return {
                ...state,
                users: payload,
            }
        case SET_USER:
            return {
                ...state,
                user: payload
            }
        case GET_USER:
            return {
                ...state,
                user: payload,
            }
        case ADD_USER:
            return {
                ...state,
                users: [...state.users, payload],
                updated: true,
            }
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(({ _id }) => _id !== payload),
            }
        case UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => {
                    if (user._id === payload._id) {
                        return payload
                    } else {
                        return user
                    }
                }),
                updated: true,
            }
        case SET_USER_UPDATED:
            return {
                ...state,
                updated: payload
            }
        case USER_FAIL:
        default:
            return {
                ...state,
            }
    }
};

export default userReducer;
