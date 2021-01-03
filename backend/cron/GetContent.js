const execPy = require('../python/execPy')

async function getContent(url) {
  var content = await execPy('../python/get_content.py', [url]);
  return content;
}

module.exports = getContent
