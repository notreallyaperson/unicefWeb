import { ARTICLE_FAIL, GET_ARTICLES, LOAD_ARTICLES } from '../types';
import axios from 'axios'
import { tokenConfig } from './authActions'
import { returnErrors, clearErrors } from './errorActions'
import { baseURL } from '../helpers'


export const getArticles = (page, filters) => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.post(`${baseURL}/articles/filters?page=${page}`, { filters }, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: GET_ARTICLES,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, ARTICLE_FAIL));
            dispatch({
                type: ARTICLE_FAIL,
            })
        })
}

export const loadArticles = (page, filter) => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.post(`${baseURL}/articles/filters?page=${page}`, { filter }, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: LOAD_ARTICLES,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, ARTICLE_FAIL));
            dispatch({
                type: ARTICLE_FAIL,
            })
        })
}