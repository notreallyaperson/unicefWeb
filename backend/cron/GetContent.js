const execPy = require('../python/execPy')

async function getContent(url) {
  var content = await execPy('../python/get_content.py', [url]);
  if (!(content.length > 0)) {
    console.log('Warning! The following article url returned no content:', url);
  }
  return content;
}

module.exports = getContent
