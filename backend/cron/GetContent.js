const execPy = require('../python/execPy')

async function getContent(url) {
  try {
    var content = await execPy('../python/get_content.py', url);
    return content

  } catch(err) {
    console.log(err)
    return null
  }
}

// function getContent(urls) {
//   // parse each article to get back promises
//   const promises = urls.map(url => parseArticle(url));
//   // Return a promise that waits for all other promises to resolve
//   return Promise.all(promises)
// }

module.exports = getContent
