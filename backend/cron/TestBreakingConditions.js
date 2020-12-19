function testCond(feeds) {
  return feeds.map( feed => {
    if (feed != null) {
      if (feed.articles.length > 0) {
        return feed
      } else {
        // TODO !!!
        console.error("a RSS feed url in the database is returning no articles")
        console.log("Fix this error! Add an attribute called broken?")
        return null
      }
    } else {
      // TODO !!!
      console.error("a RSS feed url in the database is not parsing")
      console.log("Fix this error! Add an attribute called broken?")
      return null
    }
  })
}

module.exports = testCond;
