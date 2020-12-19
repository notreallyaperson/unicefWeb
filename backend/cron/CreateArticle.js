const axios = require('axios');
const getContent = require('./GetContent');

function createArticle( _id, title, url, date, dateParsed ) {
  return getContent(url).then( content => {
    axios.post('http://localhost:5000/api/articles', { _id, title, url, date, dateParsed })
  })
}

module.exports = createArticle;
