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

function checkBloomFilter(rssFeed, url) {
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
    isNew = true;
  }
  rssFeed['bloomFilter'] = filter.saveAsJSON();

  return isNew;
}

function addToBloomFilter(rssFeed, url) {
  var filter = BloomFilter.fromJSON(rssFeed.bloomFilter);
  const suffixUrl = url.slice(rssFeed.urlPrefix.length, );
  filter.add(suffixUrl);
  rssFeed['bloomFilter'] = filter.saveAsJSON();
}

async function getContent(url) {
  // note that this has to be relative to the server (or dir the file was called from)
  var content = await execPy('./backend/python/get_content.py', [url]);
  return content;
}

function createLog(feedMetrics, type, flags, details, message) {
  var payload = { type, details, message }
  if (flags.includes('isError')) {
    payload['isError'] = true;
  }
  if (flags.includes('isWarning')) {
    payload['isWarning'] = true;
  }
  if (flags.includes('noContent')) {
    payload['noContent'] = true;
  }
  return axios.post('http://localhost:5000/api/logs', payload ).then(res => {
    if (payload.isError) {
      feedMetrics['errors'] += 1
    }
    if (payload.isWarning) {
      feedMetrics['warnings'] += 1
    }
    if (payload.noContent) {
      feedMetrics['noContent'] += 1
    }
    return null
  }).catch( err => {
    feedMetrics['loggingsFailed'] += 1
    return err
  })
}

function getTitle(article, feedMetrics, rssFeed, idOffset) {
  if (article.title) {
    return article.title;
  } else if (article.description) {
    createLog(feedMetrics, 'article', ['isWarning'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, articleId: idOffset, articleUrl: articleUrl, articleObj: article }, "Warning! The article description was used for the title as the title attribute was unavailable.");
    return article.description;
  } else {
    createLog(feedMetrics, 'article', ['isWarning'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, articleId: idOffset, articleUrl: articleUrl, articleObj: article }, "Warning! The title was set as the empty srting as the title & description attributes were unavailable. Note: the specifications of rss feed 2.0 indicate that this case should never happen.");
    return ''
  }
}

function getDate(article) {
  // Check which date attribute is present
    if ('isoDate' in article) {
      return new Date(article.isoDate).toISOString();
    } else if ('pubDate' in article) {
      return new Date(article.pubDate).toISOString();
    } else {
      return null;
    }
}

function validateContent(content, feedMetrics, rssFeed, idOffset) {
  var articleNoContentFlag = false;
  if (!(content.length > 0)) {
    articleNoContentFlag = true;
    content = '';
    createLog(feedMetrics, 'article', ['isWarning', 'noContent'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, articleId: idOffset, articleUrl: articleUrl, articleObj: article }, "Warning! This article contains no content.");
  }
  return { content, articleNoContentFlag }
}

// TODO!!!: update rss feed in database after all articles have been parsed (use a map and wait for all promises to complete)
// Parse the rss feed url to get the feed details and articles
async function parseRssFeed(rssFeed, totalArticles) {
  var feedMetrics = {
    url: rssFeed.feedUrl,
    success: 0,
    failed: 0,
    noContent: 0,
    warnings: 0,
    errors: 0,
    loggingsFailed: 0,
  };
  try {
    console.log("Processing the following feed:", rssFeed.feedUrl );
    let feed = await new Parser({ timeout:600000, maxRedirects:10 }).parseURL(rssFeed.feedUrl);      // parse articles from feed
    if (feed.items.length > 0) {      // throw error if no articles returned
      updateRssFeedFields(rssFeed, feed);     // update fields appropriately
      const promises = feed.items.map( (article) => {      // add each new article
        if (article.link) {
          const articleUrl = article.link.replace(/[\n\t\s]+/g, '');
          const idOffset = totalArticles.value;
          const isNew = checkBloomFilter(rssFeed, articleUrl);   // verify if the url has been added before
          if (isNew) {
            addToBloomFilter(rssFeed, articleUrl);
            totalArticles['value'] += 1;    // to keep track of the article _id
            totalArticles['added'] += 1;    // purely for the metrics
            return getContent(articleUrl)
            .then( content => {
              var { content, articleNoContentFlag } = validateContent(content, feedMetrics, rssFeed, idOffset);
              // Post article
              return axios.post('http://localhost:5000/api/articles', {
                                                                        _id: idOffset,
                                                                        feedId: rssFeed._id,
                                                                        title: getTitle(article, feedMetrics, rssFeed, idOffset),
                                                                        url: articleUrl,
                                                                        date: getDate(article),
                                                                        dateParsed: new Date().toISOString(),
                                                                        noContentFlag: articleNoContentFlag,
                                                                        content: content,
                                                                      })
              .then( res => {
                rssFeed['numberOfArticles'] += 1;
                feedMetrics['success'] += 1;
                return true;
              })
              .catch( err => {
                rssFeed['numberOfFailedArticles'] += 1;
                totalArticles['failed'] += 1;   // purely for the metrics
                feedMetrics['failed'] += 1;
                console.error("Error! Failed to post the following article to mongoDB:", articleUrl, err )
                return createLog(feedMetrics, 'article', ['isError'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, articleId: idOffset, articleUrl: articleUrl, articleObj: article, error: err.toString() }, "Error! Axios failed to post this article to the mongoDB database.").then( res => {
                  // Just incase, catch unlikely error if logging fails
                  if (res) {
                    console.error("Failed to post error log for the following article url:", articleUrl);
                    rssFeed.logs.push({ articleUrl: articleUrl,
                      axiosArticlePostErrorLoggingFailed: res,
                      date: new Date().toISOString()
                    });
                  }
                  return null;
                });
              });
            })
            .catch( err => {
              rssFeed['numberOfFailedArticles'] += 1;
              totalArticles['failed'] += 1;    // purely for the metrics
              feedMetrics['failed'] += 1;
              console.error("Error! Failed to parse content from the following article url:", articleUrl, err);
              createLog(feedMetrics, 'article', ['isError'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, articleId: idOffset, articleUrl: articleUrl, articleObj: article, error: err.toString() }, "Error! Failed to parse content for this article.").then( res => {
                // Just incase, catch unlikely error if logging fails
                if (res) {
                  rssFeed.logs.push({ articleUrl: articleUrl,
                    axiosArticlePostErrorLoggingFailed: res,
                    date: new Date().toISOString()
                  });
                }
                return null;

              });
            });
          } else {
            // console.log("The following article has already been added:", articleUrl);
            return true;
          }
        } else {
          return createLog(feedMetrics, 'article', ['isError'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, articleObj: article }, "Error! No link attribute for the article.").then( res => {
            return null
          });
        }
      });
      return Promise.all(promises)
        .then( res => {
          // console.log( "Articles added for", rssFeed.feedUrl, ':' , res )
          return axios.patch('http://localhost:5000/api/rssfeeds', rssFeed)       // update mongoDB rssfeed database
          .then( res => {
            console.log("Success! The following rss feed has been updated in mongoDB:", rssFeed.feedUrl);
            console.log(feedMetrics)
            return feedMetrics
          })
          .catch( err => {
            // TODO!!!: Handle this error better and remove added articles cause the rssfeeds database and the articles database would be out of sync otherwise (not urgent!)
            // Will probably just find all articles by url and delete from the database
            return createLog(feedMetrics, 'rssFeed', ['isError'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, error: err.toString() }, "Error! The rss feed has failed to update in mongoDB.").then( res => {
              feedMetrics['fatalError'] = 'Rss feed details failed to update to mongoDB!';
              return feedMetrics
            });
          });
        })
        .catch( err => {
          // TODO!!!: Handle this error better and remove added articles cause the rssfeeds database and the articles database would be out of sync otherwise (not urgent!)
          // Will probably just find all articles by url and delete from the database
          return createLog(feedMetrics, 'rssFeed', ['isError'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, error: err.toString() }, "Error! At least one of the promises to add articles did not terminate for the rss feed.").then(res => {
            return feedMetrics
          });
        });
    } else {
      // TODO !!!: Handle how to deal with database entry when no articles, maybe flag the error in the rssfeed database somehow
      return createLog(feedMetrics, 'rssFeed', ['isWarning'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl }, "Warning! No articles returned from rss parser for the rss feed.").then(res => {
        return feedMetrics;
      });
    }

  } catch(err) {
    // TODO !!!: Handle how to deal with database entry when error, maybe flag the error in the rssfeed database somehow
    console.log("Error! The following rss feed failed to parse:",rssFeed.feedUrl, err)
    return createLog(feedMetrics, 'rssFeed', ['isError'], { feedId: rssFeed._id, feedUrl: rssFeed.feedUrl, error: err.toString() }, "Error! The rss feed failed to parse.").then(res => {
      return feedMetrics
    });
  }
}

// function to get all articles from the list of RSS feed objects from mongoDB (main function)
function asyncProcessFeeds(rssFeeds, totalArticles) {
  console.log("Processing Feeds...");
  const promises = rssFeeds.map( rssFeed => parseRssFeed(rssFeed, totalArticles));
  return Promise.all(promises);
}

async function syncProcessFeeds(rssFeeds, totalArticles) {
  try {
    console.log("Processing Feeds...");
    var resultsReturned = [];
    var result;
    for (var rssFeed of rssFeeds) {
      result = await parseRssFeed(rssFeed, totalArticles);
      resultsReturned.push(result);
    }
    return resultsReturned;

  } catch (err) {
    console.error(err)
    return null
  }
}

module.exports = { asyncProcessFeeds, syncProcessFeeds };
