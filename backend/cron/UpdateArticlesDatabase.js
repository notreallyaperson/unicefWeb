const getSitePrefix = require('./GetSitePrefix');
const checkBloomFilter = require('./CheckBloomFilter');
const createArticle = require('./CreateArticle');
const { BloomFilter } = require('bloom-filters');


function updateArticlesDatabase(prevFeedAttrs, processedFeed, totalArticles) {

  var articles = processedFeed.articles;
  var articlesUrls = processedFeed.articles.map( article => article.link);
  var newSitePrefix = getSitePrefix(articlesUrls)

  // check prefix
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
  if (!('bloomFilter' in prevFeedAttrs)) {
    prevFeedAttrs['bloomFilter'] = JSON.stringify(BloomFilter.create(1000, 0.001).saveAsJSON())
  }

  // reduce list if already processed before
  const { filter , checkedUrls } = checkBloomFilter(prevFeedAttrs.bloomFilter, prevFeedAttrs.urlPrefix, articlesUrls );
  prevFeedAttrs['bloomFilter'] = filter;
  articlesUrls = checkedUrls;
  articles = articles.filter((value, index, arr) => articlesUrls[index] != null);

  // assign ids appropriately to each article and create articles
  ids = articles.map( (article, index) => totalArticles + index )

  const promises = ids.map( (id, index) => createArticle(id, prevFeedAttrs._id, articles[index].title, articles[index].link, articles[index].date, articles[index].dateParsed ) )
  Promise.all(promises)
    .then(res => {

    })
    .catch(err => {
      console.log(err)
    })

  totalArticles = totalArticles + ids.length
  const nextFeedAttrs = prevFeedAttrs;
  const nextTotalArticles = totalArticles;

  return { nextFeedAttrs, nextTotalArticles }

}

module.exports = updateArticlesDatabase;
