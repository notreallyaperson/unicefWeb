function getPrefix(urls) {

  // initialise the longest prefix to the shortest url
  var longest_prefix = Math.min(...urls.map( url => url.length ));

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
