import { GET_RSSFEEDS, RSSFEED_FAIL } from '../types';

function initialState() {
    return {
        rssFeeds: []
    };
}

const articleReducer = function (state = initialState(), action) {
    const { type, payload } = action
    switch (type) {
        case GET_RSSFEEDS:
            return {
                ...state,
                rssFeeds: payload
            };
        case RSSFEED_FAIL:
        default:
            return state;
    }
};

export default articleReducer;
