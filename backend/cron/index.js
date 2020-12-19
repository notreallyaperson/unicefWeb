const axios = require('axios');

const processFeeds = require('./ProcessFeeds');
const updateArticlesDatabase = require('./UpdateArticlesDatabase');
const updateFeedsDatabase = require('./UpdateFeedsDatabase');
const testBreakingConditions = require('./TestBreakingConditions');
const getTotalArticles = require('./GetTotalArticles')

// // Store RSS Feeds in mongoDB
// var feeds = ['http://feeds.bbci.co.uk/news/world/rss.xml', 'http://rss.cnn.com/rss/cnn_topstories.rss', 'http://techcrunch.com/feed/', 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', 'http://feeds.nature.com/nature/rss/current', 'https://news.ycombinator.com/rss', 'https://www.hindustantimes.com/rss/topnews/rssfeed.xml', 'https://www.hindustantimes.com/rss/opinion/rssfeed.xml', 'https://www.hindustantimes.com/rss/art-culture/rssfeed.xml', 'https://www.hindustantimes.com/rss/analysis/rssfeed.xml', 'https://www.reddit.com/r/worldnews/top/.rss', 'https://www.theguardian.com/world/rss', 'https://www.theguardian.com/international/rss', 'http://feeds.abcnews.com/abcnews/topstories', 'http://www.wsj.com/xml/rss/3_7085.xml', 'https://www.economist.com/the-world-this-week/rss.xml', 'https://www.economist.com/sections/business-finance/rss.xml', 'http://www.economist.com/rss/finance_and_economics_rss.xml', 'http://www.economist.com/sections/economics/rss.xml', 'https://feedx.net/rss/economist.xml', 'http://feeds.washingtonpost.com/rss/world', 'http://feeds.washingtonpost.com/rss/politics', 'http://feeds.washingtonpost.com/rss/rss_fact-checker', 'https://technology.condenast.com/feed/rss', 'https://www.forbes.com/most-popular/feed/', 'http://www.forbes.com/business/index.xml', 'http://www.forbes.com/technology/feed2/', 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', 'http://www.newyorker.com/services/rss/feeds/everything.xml', 'https://www.dailymail.co.uk/articles.rss', 'http://www.telegraph.co.uk/rss', 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', 'http://www.independent.co.uk/rss', 'http://www.independent.co.uk/news/world/rss', 'https://www.themoscowtimes.com/rss/news', 'https://www.thesun.co.uk/feed/', 'http://www.aljazeera.com/xml/rss/all.xml', 'https://www.scmp.com/rss/91/feed', 'http://www.newslookup.com/rss/business/bloomberg.rss', 'http://www.bloomberg.com/feed/bview/', 'http://www.bloomberg.com/politics/feeds/site.xml', 'http://feeds.foxnews.com/foxnews/politics', 'http://www.huffingtonpost.com/feeds/original_posts/index.xml', 'http://www.huffingtonpost.com/feeds/verticals/women/index.xml', 'http://rss.time.com/web/time/rss/top/index.xml']
//
// feeds.forEach( feed => {
//
//   axios.post('http://localhost:5000/api/rssfeeds', {"_id":feed})
//     .then( res => {
//       console.log('success')
//     })
//     .catch( err => {
//       console.log('failed');
//     })
//
// })

// get rss feeds from MongoDB
axios.get('http://localhost:5000/api/rssfeeds')
  .then( res => {

    // filter out timestamps
    rssFeeds = res.data.slice(0,1).map( obj => {
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.__v;
      return obj
    })

    var totalArticles = getTotalArticles(rssFeeds);

    // get articles and updated feed details from urls
    processFeeds(rssFeeds.map(obj => obj._id ))
      .then( processedFeeds => {

        // map element to null if breaking condition met and filter out the nulls
        processedFeeds = testBreakingConditions(processedFeeds);
        rssFeeds = rssFeeds.filter((value, index, arr) => processedFeeds[index] != null);
        processedFeeds = processedFeeds.filter((value, index, arr) => processedFeeds[index] != null);

        // Update feeds details and upload articles
        for (var i=0; i<processedFeeds.length; i++) {
          const { nextFeedAttrs, nextTotalArticles } = updateArticlesDatabase(rssFeeds[i], processedFeeds[i], totalArticles);
          rssFeeds[i] = nextFeedAttrs;
          rssFeeds[i]['numberOfArticles'] = rssFeeds[i].numberOfArticles + nextTotalArticles - totalArticles;
          // Overwrite old attributes (TODO !!! Handle change more carefully, maybe not?)
          rssFeeds[i]['title'] = processedFeeds[i].title;
          rssFeeds[i]['siteUrl'] = processedFeeds[i].link;
          totalArticles = nextTotalArticles;
        }

        // update feeds in database
        updateFeedsDatabase(rssFeeds);

      })
      .catch( err => {
        console.log(err)
      })
  })
  .catch( err => {
    console.log(err)
  })
//
// processFeeds(feeds).then(res => {
//   var count = 0;
//   res.forEach(feed => {
//
//     // findById using feed url
//
//
//     count = count + feed.articles.length;
//     // feed.articles.forEach( article => {
//     // });
//   });
//   console.log(count)
// });
//



// Filter out the articles that have already been added based on url (check bloom filter)


// Get the content of the articles


// remove the urls of the articles that failed to get content


// Add the articles to mongoDB


// Train the current LDA model
