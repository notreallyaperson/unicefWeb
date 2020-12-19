const getSitePrefix = require('./GetSitePrefix');
const checkBloomFilter = require('./CheckBloomFilter');
const createArticle = require('./CreateArticle');
const { BloomFilter } = require('bloom-filters');


function updateDatabase(prevFeedAttrs, processedFeed, totalArticles) {

  var articles = processedFeed.articles;
  var articlesUrls = processedFeed.articles.map( article => article.link);
  var newSitePrefix = getSitePrefix(articlesUrls)

  // Overwrite old attributes (TODO !!! Handle change more carefully?)
  prevFeedAttrs['title'] = processedFeed.title;
  prevFeedAttrs['siteUrl'] = processedFeed.link;

  if ('urlPrefix' in prevFeedAttrs) {
    if (prevFeedAttrs.urlPrefix != newSitePrefix){
      newSitePrefix = getSitePrefix([prevFeedAttrs.urlPrefix, newSitePrefix])
      prevFeedAttrs['urlPrefix'] = newSitePrefix;
      delete prevFeedAttrs.bloomFilter
    }
  } else {
    prevFeedAttrs['urlPrefix'] = newSitePrefix;
  }

  // initialise bloom fliter
  if (!'bloomFilter' in prevFeedAttrs) {
    prevFeedAttrs['bloomFilter'] = JSON.stringify(BloomFilter.create(10000, 0.001).saveAsJSON())
  }

  const { filter , checkedUrls } = checkBloomFilter(prevFeedAttrs.bloomFilter, prevFeedAttrs.urlPrefix, articlesUrls );
  prevFeedAttrs['bloomFilter'] = filter;
  articlesUrls = checkedUrls
  articles.filter((value, index, arr) => articlesUrls[index] != null);

  ids = articles.map( (article, index) => totalArticles + index )
  // const promises = ids.map( (id, index) => createArticle(id, articles[index].title, articles[index].link, articles[index].date, articles[index].dateParsed ) )
  totalArticles = totalArticles + ids.length
  const nextFeedAttrs = prevFeedAttrs;
  const nextTotalArticles = totalArticles;
  return { nextFeedAttrs, nextTotalArticles }





}

module.exports = updateDatabase;
