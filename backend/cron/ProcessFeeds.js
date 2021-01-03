const Parser = require('rss-parser');
const axios = require('axios');
const { BloomFilter } = require('bloom-filters');
const execPy = require('../python/execPy')

const bloomFilterSize = 1000;
const bloomFilterAccuracy = 0.001;


function getSitePrefix(urls, shortest=-1) {

  // initialise the longest common prefix to the shortest url
  // TODO: improve efficiency of finding the min
  var longest_prefix;
  if (shortest < 0) {
    longest_prefix = Math.min(...urls.map( url => url.length ));
  } else {
    longest_prefix = shortest;
  }

  // find the index of the longest prefix
  for (var i=0; i<urls.length; i++) {
    for (var j=longest_prefix; j>0; j--){
      if (urls[i].slice(0,j) == urls[0].slice(0,j)) {
        longest_prefix = j;
        break;
      }
    }
  }
  return urls[0].slice(0, longest_prefix);
}

function updateRssFeedFields(rssFeed, feed) {
  // update fields if required
  // 1. & 2.
  if ( !('urlPrefix' in rssFeed) || !('bloomFilter' in rssFeed) ) {
    var shortestUrl = feed.items[0].link.length;
    var urls = feed.items.map(item => {
      if (item.link.length < shortestUrl) {
        shortestUrl = item.link.length;
      }
      return item.link;
    });
    rssFeed['urlPrefix'] = getSitePrefix(urls, shortestUrl);
    rssFeed['bloomFilter'] = BloomFilter.create(bloomFilterSize, bloomFilterAccuracy).saveAsJSON();
  }
  // 3.
  if (rssFeed.siteUrl != feed.link) {
    // TODO!!! : Maybe handle better what to do when the siteUrl changes?
    rssFeed['siteUrl'] = feed.link;
  }
  // 4.
  if (rssFeed.title != feed.title) {
    // TODO!!! : Maybe handle better what to do when the title changes?
    rssFeed['title'] = feed.title;
  }
}

function updateBloomFilter(rssFeed, url) {
  var filter = BloomFilter.fromJSON(rssFeed.bloomFilter);
  const prefixCheck = getSitePrefix([ rssFeed.urlPrefix, url]);
  if (rssFeed.urlPrefix != prefixCheck) {
    // TODO!!!: Maybe handle case where prefix changes better?
    filter = BloomFilter.create(bloomFilterSize, bloomFilterAccuracy)
    rssFeed['urlPrefix'] = prefixCheck
  }
  if (filter._length >= bloomFilterSize) {
    // TODO!!!: Maybe handle case where filter has too many entries better?
    filter = BloomFilter.create(bloomFilterSize, bloomFilterAccuracy)
  }
  const suffixUrl = url.slice(rssFeed.urlPrefix.length, );
  var isNew;
  if (filter.has(suffixUrl)) {
    isNew = false;
  } else {
    filter.add(suffixUrl);
    isNew = true;
  }
  rssFeed['bloomFilter'] = filter.saveAsJSON();

  return isNew;
}

async function getContent(url) {
  var content = await execPy('../python/get_content.py', [url]);
  if (!(content.length > 0)) {
    console.log('Warning! The following article url returned no content:', url);
  }
  return content;
}

function getDate(article) {
  // Check which date attribute is present
    var articleDate;
    if ('isoDate' in article) {
      articleDate = article.isoDate;
    } else if ('pubDate' in article) {
      articleDate = article.pubDate;
    } else {
      articleDate = '';
    }
    return new Date(articleDate).toISOString();
}


// TODO!!!: update rss feed in database after all articles have been parsed (use a map and wait for all promises to complete)
// Parse the rss feed url to get the feed details and articles
async function parseRssFeed(rssFeed, totalArticles) {
  try {
    console.log("Processing the following feed:", rssFeed.feedUrl );
    let feed = await new Parser({ timeout:600000, maxRedirects:10 }).parseURL(rssFeed.feedUrl);      // parse articles from feed
    if (feed.items.length > 0) {      // throw error if no articles returned
      console.log("Updating the fields of the following feed:", rssFeed.feedUrl);
      updateRssFeedFields(rssFeed, feed);     // update fields appropriately
      console.log("Adding articles for the following feed:", rssFeed.feedUrl);
      const promises = feed.items.map( (article) => {      // add each new article
        var articleUrl = article.link.replace(/[\n\t\s]+/g, '');
        const idOffset = totalArticles.value;
        const isNew = updateBloomFilter(rssFeed, articleUrl);   // verify if the url has been added before
        if (isNew) {
          totalArticles['value'] += 1;    // to keep track of the article _id
          totalArticles['added'] += 1;    // purely for the metrics
          return getContent(articleUrl)
          .then( content => {
            var newArticle = {
                            _id: idOffset,
                            feedId: rssFeed._id,
                            title: article.title,
                            url: articleUrl,
                            date: getDate(article),
                            dateParsed: new Date().toISOString(),
                            content: content,
                          };
            if (!(content.length > 0)) {
              newArticle['noContentFlag'] = true;
            }
            return axios.post('http://localhost:5000/api/articles', newArticle)
            .then( res => {
              console.log("Success! The following article has been added to mongoDB:", articleUrl )
              rssFeed['numberOfArticles'] += 1;
              return true;
            })
            .catch( err => {
              rssFeed['numberOfFailedArticles'] += 1;
              totalArticles['failed'] += 1;   // purely for the metrics
              console.error("Error! Failed to post the following article to the mongoDB database:",  articleUrl, err.response.data);
              return null;
            });
          })
          .catch( err => {
            rssFeed['numberOfFailedArticles'] += 1;
            totalArticles['failed'] += 1;    // purely for the metrics
            console.error("Error! Failed to parse content from the following article url:", articleUrl, err);
            return null;
          });
        } else {
          console.log("The following article has already been added:", articleUrl);
          return true;
        }

      });
      return Promise.all(promises)
        .then( res => {
          return axios.patch('http://localhost:5000/api/rssfeeds', rssFeed)       // update mongoDB rssfeed database
          .then( res => {
            console.log("Success! The following rss feed has been updated in mongoDB:", rssFeed.feedUrl);
            return true
          })
          .catch( err => {
            // TODO!!!: Handle this error better and remove added articles cause the rssfeeds database and the articles database would be out of sync otherwise (not urgent!)
            console.error('Error! The following rss feed has failed to update in mongoDB:', rssFeed.feedUrl, err.response.data);
            return null
          });
        })
        .catch( err =>{

        });
      // return true;
    } else {
      // TODO !!!: Handle how to deal with database entry when no articles, maybe flag the error in the rssfeed database somehow
      console.error("Error! No articles returned from rss parser for the following feed:", rssFeed.feedUrl);
      return null;
    }

  } catch(err) {
    // TODO !!!: Handle how to deal with database entry when error, maybe flag the error in the rssfeed database somehow
    console.error("Error! the following feed failed to parse:", rssFeed.feedUrl, err);
    return null;
  }
}

// function to get all articles from the list of RSS feed objects from mongoDB (main function)
function processFeeds(rssFeeds, totalArticles) {
  console.log("Processing Feeds...");
  const promises = rssFeeds.map( rssFeed => parseRssFeed(rssFeed, totalArticles));
  return Promise.all(promises);
}

module.exports = processFeeds;
