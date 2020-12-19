const parseRssFeed = require('./ParseRssFeed')

// Asynchronous function to get all articles from a list of RSS feed urls
// Function of type: [str] -> [ { rss: str , title: str, link: str, articles: [{ title: str, link: str, date: str, dateParsed: str }] } ]
function processFeeds(urls) {
  // convert all urls' https to http (so rssfeed _id is unique)
  urls = urls.map( url => url.replace(/https/g, 'http') )
  // parse each feed to get back promises
  const promises = urls.map( (url, index) => parseRssFeed(url, index))
  // Return a promise that waits for all other promises to resolve
  return Promise.all(promises)

}

// export the function
module.exports = processFeeds;
