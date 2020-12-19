const { BloomFilter } = require('bloom-filters');

function checkBloomFilter(filter, prefix, urls) {
  // assuming the prefix stayed the same
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

  filter = filter.saveAsJSON()

  return { filter , checkedUrls }
}

module.exports = checkBloomFilter
