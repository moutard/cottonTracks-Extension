'use strict'

var country_with_sub_domains = ['.uk'];

function UrlParser(sUrl) {
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

  // Host and country
  var iIndexOfLastDot = this.hostname.lastIndexOf('.');
  this.country = this.hostname.substr(iIndexOfLastDot);
  this.hostname_without_country = this.hostname.substr(0, iIndexOfLastDot);

  if(country_with_sub_domains.indexOf(this.country)){
    // For the moment do nothing.
  }

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

  this.isGoogle = (this.hostname_without_country === "www.google"
                    || this.hostname_without_country  === "www.google.co")
  this.isGoogleMap = (this.hostname_without_country === "maps.google"
                    || this.hostname_without_country === "maps.google.co")
  this.isVimeo = (this.hostname_without_country === "vimeo");

  this.isHttps = (this.protocol === "https:");

  if(this.pathname === "/search"){
    this.generateKeywords();
  }
}

// PROTOTYPE
UrlParser.prototype.fineDecomposition = function() {
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

UrlParser.prototype.generateKeywords = function() {
  // KEYWORDS
  // Compute queries keywords - under q=key1+key2 -
  if (this.dSearch === undefined) {
    this.fineDecomposition();
  }
  this.keywords = new Array();

  // keywords can be separate by '+' or ' '
  // in a url caracters are escape so '+' of '%20'
  var oSplitKeywordsRegExp = new RegExp('%20|\\+', 'g');
  if (this.dHash.q !== undefined) {
    this.keywords = this.keywords.concat(this.dHash.q
        .split(oSplitKeywordsRegExp));
  }
  if (this.dSearch.q !== undefined) {
    this.keywords = this.keywords.concat(this.dSearch.q
        .split(oSplitKeywordsRegExp));
  }

  // lower Case
  for ( var j = 0; j < this.keywords.length; j++) {
    this.keywords[j] = decodeURIComponent(this.keywords[j]).toLowerCase();
  }

};

// README
// This system is principaly designed for google search. it maybe interesting
// to see if 'bing', 'yahoo', or 'duckduckgo' have the same conventions.
// Extract q (keywords queries) can give an important information about a story.
// Extract aq (keywords queries you did just before the current query). Should
// be very pertinent to join two queries.