import { ADD_USER, DELETE_USER, USER_FAIL, GET_USER, GET_USERS, SET_USER_UPDATED, UPDATE_USER, SET_USER } from '../types'
import axios from 'axios'
import { tokenConfig } from './authActions'
import { returnErrors, clearErrors } from './errorActions'
import { baseURL } from '../helpers'

export const getUsers = () => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.get(`${baseURL}/users`, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: GET_USERS,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, USER_FAIL));
            dispatch({
                type: USER_FAIL,
            })
        })
}

export const getUser = (id) => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.get(`${baseURL}/users/${id}`, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: GET_USER,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, USER_FAIL));
            dispatch({
                type: USER_FAIL,
            })
        })
}

export const addUser = requestBody => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.post(`${baseURL}/users`, requestBody, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: ADD_USER,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, USER_FAIL));
            dispatch({
                type: USER_FAIL,
            })
        })
}

export const deleteUser = id => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.delete(`${baseURL}/users/${id}`, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: DELETE_USER,
                payload: id
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, USER_FAIL));
            dispatch({
                type: USER_FAIL,
            })
        })
}

export const updateUser = requestBody => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.patch(`${baseURL}/users`, requestBody, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: UPDATE_USER,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, USER_FAIL));
            dispatch({
                type: USER_FAIL,
            })
        })
}

export const setUser = user => (dispatch) => {
    dispatch({
        type: SET_USER,
        payload: user
    })
}

export const setUpdated = state => (dispatch) => {
    dispatch({
        type: SET_USER_UPDATED,
        payload: state,
    })
}