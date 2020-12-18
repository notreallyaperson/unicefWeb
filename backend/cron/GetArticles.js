// Retrieve our RSS feed URL list

let Parser = require('rss-parser');
let parser = new Parser();


// Parse the rss feed url to get the feed details and articles (supplementary function to getArticles())
async function parseFeed(url) {

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
                                  'link': item.link,
                                  'date': articleDate,
                                  'dateParsed': new Date().toISOString()
                                })
    });
    return feedObj

  } catch(err) {
    console.log("ERROR -------------------------")
    console.log(url)
    console.log(err)

    return null
  }
}

// Asynchronous function to get all articles from a list of RSS feed urls
// Function of type: [str] -> [ { rss: str , title: str, link: str, articles: [{ title: str, link: str, date: str, dateParsed: str }] } ]
function getArticles(feeds) {
  // Keep list of all promises
  var promises = [];

  // loop through all urls
  for (var i=0; i<feeds.length; i++ ) {
    // Get promise from feed parser
    promises.push(parseFeed(feeds[i]))
  }

  // Return a proise that waits for all other promises to respolve
  return Promise.all(promises).then( values => {
    return values.filter((element) => {
      return element != null;
    } )
  })
}

// TESTING

// Hardcode list of feeds
const feeds = ['http://feeds.bbci.co.uk/news/world/rss.xml', 'http://rss.cnn.com/rss/cnn_topstories.rss', 'http://techcrunch.com/feed/', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 'http://feeds.nature.com/nature/rss/current', 'https://news.ycombinator.com/rss', 'https://www.hindustantimes.com/rss/topnews/rssfeed.xml', 'https://www.hindustantimes.com/rss/opinion/rssfeed.xml', 'https://www.hindustantimes.com/rss/art-culture/rssfeed.xml', 'https://www.hindustantimes.com/rss/analysis/rssfeed.xml', 'https://www.reddit.com/r/worldnews/top/.rss', 'https://www.theguardian.com/world/rss', 'https://www.theguardian.com/international/rss', 'http://feeds.abcnews.com/abcnews/topstories', 'http://www.wsj.com/xml/rss/3_7085.xml', 'https://www.economist.com/the-world-this-week/rss.xml', 'https://www.economist.com/sections/business-finance/rss.xml', 'http://www.economist.com/rss/finance_and_economics_rss.xml', 'http://www.economist.com/sections/economics/rss.xml', 'https://feedx.net/rss/economist.xml', 'http://feeds.washingtonpost.com/rss/world', 'http://feeds.washingtonpost.com/rss/politics', 'http://feeds.washingtonpost.com/rss/rss_fact-checker', 'https://technology.condenast.com/feed/rss', 'https://www.forbes.com/most-popular/feed/', 'http://www.forbes.com/business/index.xml', 'http://www.forbes.com/technology/feed2/', 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', 'http://www.newyorker.com/services/rss/feeds/everything.xml', 'https://www.dailymail.co.uk/articles.rss', 'http://www.telegraph.co.uk/rss', 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', 'http://www.independent.co.uk/rss', 'http://www.independent.co.uk/news/world/rss', 'https://www.themoscowtimes.com/rss/news', 'https://www.thesun.co.uk/feed/', 'http://www.aljazeera.com/xml/rss/all.xml', 'https://www.scmp.com/rss/91/feed', 'http://www.newslookup.com/rss/business/bloomberg.rss', 'http://www.bloomberg.com/feed/bview/', 'http://www.bloomberg.com/politics/feeds/site.xml', 'http://feeds.foxnews.com/foxnews/politics', 'http://www.huffingtonpost.com/feeds/original_posts/index.xml', 'http://www.huffingtonpost.com/feeds/verticals/women/index.xml', 'http://rss.time.com/web/time/rss/top/index.xml']

// Testing the function
getArticles(feeds.slice(0, 5)).then(res => {
  console.log(res)
  console.log(res[0].articles)
})


// Conver RSS feed data into JSON
// Title, URL, Date

/*   DONE ABOVE: getArticles()   */

// Store RSS feed data into Mongo db
