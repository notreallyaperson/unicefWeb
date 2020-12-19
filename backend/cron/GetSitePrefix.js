function getPrefix(urls) {

  // initialise the longest common prefix to the shortest url
  // TODO: improve efficiency of finding the min
  var longest_prefix = Math.min(...urls.map( url => url.length ));

  // find the index of the longest prefix
  console.log(urls[0].slice(0, longest_prefix))
  for (var i=0; i<urls.length; i++) {
    for (var j=longest_prefix; j>0; j--){
      console.log(urls[0].slice(0, j))
      console.log(urls[i].slice(0, j))
      if (urls[i].slice(0,j) == urls[0].slice(0,j)) {
        console.log('TRUE')
        longest_prefix = j;
        break;
      }
    }
  }
  return urls[0].slice(0, longest_prefix);
}

module.exports = getPrefix


// getPrefix(['https://python-docx.readtthedocs.io/en/latest/something', 'http://thepangean.com', 'https://python-docx.readthedocs.io/en/latest/api/text.html#docx.text.run.Run', 'https://python-docx.readthedocs.io/en/latest/api/dml.html#docx.dml.color.ColorFormat', 'https://python-docx.readthedocs.io/en/latest/api/document.html#coreproperties-objects'])
