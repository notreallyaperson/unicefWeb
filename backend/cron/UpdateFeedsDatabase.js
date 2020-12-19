const axios = require('axios');

function updateFeedsDatabase(rssFeedAttrs) {
  axios.patch('http://localhost:5000/api/rssfeed', rssFeedAttrs)
    .then( res => {
      console.log(res)
    }).catch( err => {
      console.log(err)
    })
  // TODO !!! add error handling for this promise
}

module.exports = updateFeedsDatabase
