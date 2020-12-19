const updateFeed = require('./UpdateFeed')

function updateFeedsDatabase(rssFeedsAttrs) {
  const promises = rssFeedsAttrs.map( rssFeedAttrs => updateFeed(rssFeedAttrs))
  return Promise.all(promises)
}

module.exports = updateFeedsDatabase
