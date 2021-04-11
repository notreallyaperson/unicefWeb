import { GET_ARTICLES, ARTICLE_FAIL, LOAD_ARTICLES } from '../types';

function initialState() {
    return {
        articles: []
    };
}

const articleReducer = function (state = initialState(), action) {
    const { type, payload } = action
    switch (type) {
        case GET_ARTICLES:
            return {
                ...state,
                articles: payload
            };
        case LOAD_ARTICLES:
            return {
                ...state,
                articles: [...state.articles, ...payload]
            };
        case ARTICLE_FAIL:
        default:
            return state;
    }
};

export default articleReducer;
