function getTotalNumOfArticles(rssFeeds) {
  return rssFeeds.map( rssFeed => rssFeed.numberOfArticles).reduce((a,b) => a + b)
}

module.exports = getTotalNumOfArticles;
