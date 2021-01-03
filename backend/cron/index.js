const axios = require('axios');
const processFeeds = require('./ProcessFeeds');

// Store/Delete RSS Feeds in mongoDB

function addFeeds() {
  var feeds = ['http://feeds.bbci.co.uk/news/world/rss.xml', 'http://rss.cnn.com/rss/cnn_topstories.rss', 'http://techcrunch.com/feed/', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 'http://feeds.nature.com/nature/rss/current', 'https://news.ycombinator.com/rss', 'https://www.hindustantimes.com/rss/topnews/rssfeed.xml', 'https://www.hindustantimes.com/rss/opinion/rssfeed.xml', 'https://www.hindustantimes.com/rss/art-culture/rssfeed.xml', 'https://www.hindustantimes.com/rss/analysis/rssfeed.xml', 'https://www.reddit.com/r/worldnews/top/.rss', 'https://www.theguardian.com/world/rss', 'https://www.theguardian.com/international/rss', 'http://feeds.abcnews.com/abcnews/topstories', 'http://www.wsj.com/xml/rss/3_7085.xml', 'https://www.economist.com/the-world-this-week/rss.xml', 'https://www.economist.com/sections/business-finance/rss.xml', 'http://www.economist.com/rss/finance_and_economics_rss.xml', 'http://www.economist.com/sections/economics/rss.xml', 'https://feedx.net/rss/economist.xml', 'http://feeds.washingtonpost.com/rss/world', 'http://feeds.washingtonpost.com/rss/politics', 'http://feeds.washingtonpost.com/rss/rss_fact-checker', 'https://technology.condenast.com/feed/rss', 'https://www.forbes.com/most-popular/feed/', 'http://www.forbes.com/business/index.xml', 'http://www.forbes.com/technology/feed2/', 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', 'http://www.newyorker.com/services/rss/feeds/everything.xml', 'https://www.dailymail.co.uk/articles.rss', 'http://www.telegraph.co.uk/rss', 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', 'http://www.independent.co.uk/rss', 'http://www.independent.co.uk/news/world/rss', 'https://www.themoscowtimes.com/rss/news', 'https://www.thesun.co.uk/feed/', 'http://www.aljazeera.com/xml/rss/all.xml', 'https://www.scmp.com/rss/91/feed', 'http://www.newslookup.com/rss/business/bloomberg.rss', 'http://www.bloomberg.com/feed/bview/', 'http://www.bloomberg.com/politics/feeds/site.xml', 'http://feeds.foxnews.com/foxnews/politics', 'http://www.huffingtonpost.com/feeds/original_posts/index.xml', 'http://www.huffingtonpost.com/feeds/verticals/women/index.xml', 'http://rss.time.com/web/time/rss/top/index.xml']

  feeds.forEach( feed => {
    axios.post('http://localhost:5000/api/rssfeeds', { feedUrl: feed })
    .then( res => {
      // console.log(res.data)
      console.log('success', feed)
    })
    .catch( err => {
      console.log('failed', feed, err.response.data);
    })

  })
}

function runCron() {
  const start = Date.now();

  // get rss feeds from MongoDB
  return axios.get('http://localhost:5000/api/rssfeeds')
  .then( rssFeeds => {

    // get total number of articles (tracked by the _id + 1)
    return axios.get('http://localhost:5000/api/articles/total')
    .then( totalArticles => {
      totalArticles = totalArticles.data;
      totalArticles['added'] = 0;
      totalArticles['failed'] = 0;
      rssFeeds = rssFeeds.data.slice(0,)   // reduce number of feeds
      console.log(rssFeeds)
      // get articles and update feed details
      return processFeeds(rssFeeds, totalArticles)
      .then( res => {
        return {
                  feedsProcessed: res,
                  totalArticles: totalArticles,
                  timeTaken: (Date.now() - start).toString() + 'ms'
                }
      })
      .catch( err => {
        // console.error(err)
        return { Error: err }
      });

    })
    .catch( err => {
      // console.error(err)
      return { Error: err }
    })
  })
  .catch( err => {
    // console.error(err)
    return { Error: err }
  })
}

// Train the current LDA model

module.exports = runCron;
