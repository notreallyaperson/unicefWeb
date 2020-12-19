const { BloomFilter } = require('bloom-filters');

function checkBloomFilter(filter, prefix, urls) {
  filter = BloomFilter.fromJSON(JSON.parse(filter));

  checkedUrls = urls.map(url => {
    suffixUrl = url.slice(prefix.length, );
    if (filter.has(suffixUrl)) {
      return null
    } else {
      filter.add(suffixUrl)
      return url
    }
  })

  filter = JSON.stringify(filter.saveAsJSON())

  return { filter , checkedUrls }
}

module.exports = checkBloomFilter
