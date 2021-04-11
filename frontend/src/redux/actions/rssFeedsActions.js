import { RSSFEED_FAIL, GET_RSSFEEDS } from '../types';
import axios from 'axios'
import { tokenConfig } from './authActions'
import { returnErrors, clearErrors } from './errorActions'
import { baseURL } from '../helpers'


export const getRssFeeds = () => (dispatch, getState) => {
    dispatch(clearErrors())
    axios.get(`${baseURL}/rssfeeds/frontend`, tokenConfig(getState))
        .then(response => {
            dispatch({
                type: GET_RSSFEEDS,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, RSSFEED_FAIL));
            dispatch({
                type: RSSFEED_FAIL,
            })
        })
}