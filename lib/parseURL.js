// by rmoutard for CottonTracks

function parseUrl(sUrl) {
  // CLASS
  // save the unmodified url to href property

  // attributes
  var href, protocol, host, hostname, port, pathname, hash, search, dHash, dSearch;

  this.href = sUrl;

  // split the URL by single-slashes to get the component parts
  var parts = sUrl.replace('//', '/').split('/');

  // store the protocol and host
  this.protocol = parts[0];
  this.host = parts[1];

  // extract any port number from the host
  // from which we derive the port and hostname
  parts[1] = parts[1].split(':');
  this.hostname = parts[1][0];
  this.port = parts[1].length > 1 ? parts[1][1] : '';

  // splice and join the remainder to get the pathname
  parts.splice(0, 2);
  this.pathname = '/' + parts.join('/');

  // HASH
  // extract any hash - delimited by '#' -
  this.pathname = this.pathname.split('#');
  this.hash = this.pathname.length > 1 ? this.pathname[1] : '';

  this.pathname = this.pathname[0];

  // SEARCH
  // extract any search query - delimited by '?' -
  this.pathname = this.pathname.split('?');
  this.search = this.pathname.length > 1 ? this.pathname[1] : '';

  this.pathname = this.pathname[0];

}

// PROTOTYPE
parseUrl.prototype.fineDecomposition = function (){
  // Decompose the url with a fine granularity. Put each paramters in a
  // dedicated dictionnary.

  // HASH
  var dHash = {};
  // Extract parameters from the Hash
  var lHash = this.hash.split('&');
  for ( var i = 0; i < lHash.length; i++) {
    var parameter = lHash[i].split('=');
    dHash[parameter[0]] = parameter[1];
  }
  this.dHash = dHash;

  // SEARCH
  var dSearch = {};
  // Extract parameters from the Search
  var lSearch = this.search.split('&');
  for ( var i = 0; i < lSearch.length; i++) {
    var parameter = lSearch[i].split('=');
    dSearch[parameter[0]] = parameter[1];
  }
  this.dSearch = dSearch;

};

parseUrl.prototype.generateKeywords = function () {
  // KEYWORDS
  // Compute queries keywords - under q=key1+key2 -
  if(this.dSearch === undefined){
    this.fineDecomposition();
  }
  this.keywords = new Array();

  // keywords can be separate by '+' or ' '
  // in a url caracters are escape so '+' of '%20'
  var oSplitKeywordsRegExp = new RegExp('%20|\\+', 'g');
  if (this.dHash.q !== undefined) {
    this.keywords = this.keywords.concat(this.dHash.q.split(oSplitKeywordsRegExp));
  }
  if (this.dSearch.q !== undefined) {
    this.keywords = this.keywords.concat(this.dSearch.q.split(oSplitKeywordsRegExp));
  }

};

parseUrl.prototype.previousKeywords = function () {
  // PREVIOUS KEYWORDS
  // compute previous keywords - under aq=key1+key2 -
  this.previousKeywords = new Array();

  // keywords can be separate by '+' or ' '
  // in a url caracters are escape so '+' of '%20'
  var oSplitKeywordsRegExp = new RegExp('%20|\\+', 'g');
  if (this.dHash.aq !== undefined) {
    this.previousKeywords = this.previousKeywords.concat(dHash.aq
        .split(oSplitKeywordsRegExp));
  }
  if (this.dSearch.aq !== undefined) {
    this.previousKeywords = this.previousKeywords.concat(dSearch.aq
        .split(oSplitKeywordsRegExp));
  }

};

// README
// This system is principaly designed for google search. it maybe interesting
// to see if 'bing', 'yahoo', or 'duckduckgo' have the same conventions.
// Extract q (keywords queries) can give an important information about a story.
// Extract aq (keywords queries you did just before the current query). Should
// be very pertinent to join two queries.

// DEPRECATED
// use the object parseUrl
function extractQ(sUrl) {
  // Extract the keywords used to make the search on google
  // http://www.google.fr/webhp?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=fr&gs_nf=1&cp=10&gs_id=3n&xhr=t&q=jennifer+aniston&pq=tets&pf=p&sclient=psy-ab&site=webhp&source=hp&pbx=1&oq=jennifer+a&aq=0&aqi=g4&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=6fc8c6804cede81f&ix=seb&ion=1&biw=1438&bih=727
  // q=jennifer+aniston

  // result
  var lKeywordsQueries = Array();
  var oRegExpExtractAllKeywords = new RegExp('(&|\\?)q=([a-zA-Z0-9\\+]*)&?',
      'g');
  // http://www.google.com?q=key1+key2+key3 return ["?q=key1+key2+key3", "?",
  // "key1+key2+key3"]

  var oRegExpResult = oRegExpExtractAllKeywords.exec(sUrl);
  if (oRegExpResult != null) {
    var sAllKeywords = oRegExpResult[2];

    var oRegExpExtractEachKeyword = new RegExp('([a-zA-Z0-9]+)\\+?', 'g');
    // key1+key2+key3 return ["key1+", "key1"]

    var lExtractedKeyword = oRegExpExtractEachKeyword.exec(sAllKeywords);

    while (lExtractedKeyword != null) {
      lKeywordsQueries.push(lExtractedKeyword[1]);
      lExtractedKeyword = oRegExpExtractEachKeyword.exec(sAllKeywords);
    }

  }
  return lKeywordsQueries;

}
