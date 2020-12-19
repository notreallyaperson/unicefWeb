const Parser = require('rss-parser');


// Parse the rss feed url to get the feed details and articles 
async function parseFeed(url) {

  let parser = new Parser();

  // store index locally in async func
  try {
    // Parse articles from feed
    let feed = await parser.parseURL(url);

    // Keep track of articles from the feed
    var feedObj = {};
    feedObj['rss'] = url;
    feedObj['title'] = feed.title;
    feedObj['link'] = feed.link
    feedObj['articles'] = []

    // Append list of articles to feedObj
    feed.items.forEach(item => {

      // Check which date attribute is present
      var articleDate;
      if ('isoDate' in item) {
        articleDate = item.isoDate;
      } else if ('pubDate' in item) {
        articleDate = new Date (item.pubDate);
      } else {
        articleDate = '';
      }

      // Append article
      feedObj['articles'].push( { 'title': item.title,
                                  'link': (item.link).replace(/[\n\t\s]+/g, ''),
                                  'date': articleDate,
                                  'dateParsed': new Date().toISOString()
                                })
    });

    return feedObj

  } catch(err) {
    // console.log("ERROR -------------------------")
    // console.log(url)
    // console.log(err)

    return null
  }
}

module.exports = parseFeed;
