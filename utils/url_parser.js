'use strict'

function UrlParser(sUrl) {
  var country_with_sub_domains = ['.uk'];
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
  this.service = this.hostname_without_country.split('.')[1];

  if(country_with_sub_domains.indexOf(this.country)){
    // For the moment do nothing.
  }

  // splice and join the remainder to get the pathname
  parts.splice(0, 2);
  this.pathname = '/' + parts.join('/');

  // HASH
  // extract any hash - delimited by '#' -
  this.pathname = this.pathname.split('#');
  if(parts[0]){
    this.hash = parts[0].split('#')[1] || "";
  } else {
    this.hash = '';
  }


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
    this.genericSearch();
    this.imageSearchPreviewSource();
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
  for ( var i = 0, iLength = lHash.length; i < iLength; i++) {
    var parameter = lHash[i].split('=');
    dHash[parameter[0]] = parameter[1];
  }
  this.dHash = dHash;

  // SEARCH
  var dSearch = {};
  // Extract parameters from the Search
  var lSearch = this.search.split('&');
  for ( var i = 0, iLength = lSearch.length; i < iLength; i++) {
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
  this.keywords = [];

  // keywords can be separate by '+' or ' '
  // in a url caracters are escape so '+' of '%20'
  var oSplitKeywordsRegExp = new RegExp('%20|\\+', 'g');
  if (this.dHash['q'] !== undefined) {
    this.keywords = this.keywords.concat(this.dHash['q']
        .split(oSplitKeywordsRegExp));
  } else if (this.dSearch['q'] !== undefined) {
    this.keywords = this.keywords.concat(this.dSearch['q']
        .split(oSplitKeywordsRegExp));
  }

  // lower Case
  for ( var j = 0, iLength = this.keywords.length; j < iLength; j++) {
    this.keywords[j] = decodeURIComponent(this.keywords[j]).toLowerCase();
  }

};

UrlParser.prototype.genericSearch = function() {
  // Two identical searches are different if they have been made in a different way
  // omnibox, suggestion, google site, language, timestamp, ...
  // keep only the common part. Start with keywords
  this.genericSearch = this.protocol + "//" + this.hostname + "/search?q="
    + this.keywords.join("+");
};

UrlParser.prototype.imageSearchPreviewSource = function() {
  if (this.dHash['imgrc'] && this.dHash['imgrc'] !== "_"){
    var sUnescaped = this.replaceHexa(this.dHash['imgrc']);
    this.searchImage = "http" + sUnescaped.split("http")[1].split(";")[0];
  }
};

UrlParser.prototype.replaceHexa = function(sEscaped){
    var reg = /\%25/;
    if (reg.test(sEscaped)){
      // need to replace twice the % in case it was already escaped
      var sUnescaped = sEscaped.replace(/\%25/g,'%')
          .replace(/\%25/g,'%')
          .replace(/\%21/g,'!')
          .replace(/\%22/g,'"')
          .replace(/\%23/g,'#')
          .replace(/\%24/g,'$')
          .replace(/\%26/g,'&')
          .replace(/\%27/g,"'")
          .replace(/\%2B/g,'+')
          .replace(/\%2F/g,'/')
          .replace(/\%3F/g,'?')
          .replace(/\%3A/g,":")
          .replace(/\%3B/g,"\;")
          .replace(/\%3D/g,'=');
    return sUnescaped;
    } else {
	  return sEscaped;
    }
};

// README
// This system is principaly designed for google search. it maybe interesting
// to see if 'bing', 'yahoo', or 'duckduckgo' have the same conventions.
// Extract q (keywords queries) can give an important information about a story.
// Extract aq (keywords queries you did just before the current query). Should
// be very pertinent to join two queries.
