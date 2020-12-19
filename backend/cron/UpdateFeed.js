const axios = require('axios');

function updateFeed( rssFeedAttrs ) {
  return axios.patch('http://localhost:5000/api/rssfeeds', rssFeedAttrs)
}

module.exports = updateFeed;
