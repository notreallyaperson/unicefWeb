function getPrefix(urls, shortest=-1) {

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

module.exports = getPrefix


// getPrefix(['https://python-docx.readtthedocs.io/en/latest/something', 'http://thepangean.com', 'https://python-docx.readthedocs.io/en/latest/api/text.html#docx.text.run.Run', 'https://python-docx.readthedocs.io/en/latest/api/dml.html#docx.dml.color.ColorFormat', 'https://python-docx.readthedocs.io/en/latest/api/document.html#coreproperties-objects'])
