'use strict';
/**
 * Class in charge of parsing url, to extract main informations.
 *
 * @param {String} sUrl: url you want to parse.
 * Ex :
 * http://fr.wikipedia.org/wiki/Wolfgang_Amadeus_Mozart
 * protocol + :// + hostname + pathname
 *
 *  href // the complete and well formatted url (decodeURIComponents)
 *  protocol, // http, https, ftp
 *  host, // name of the website fr.wikipedia.org
 *  hostname, //
 *  country, // .fr, .com, .org
 *  port, // if one :8080
 *  service, // central part of the host like wikipedia, google
 *  pathname, // after the port, the /wiki/Wolfgang_Amadeus_Mozart
 *  hash, // after #
 *  search, // after ?
 *  dHash, // dictionnary of parameters that appears in the hash part
 *  dSearch; // dictionnary of parameters that appears in the search part
 *
 *  error // store the error here if an error appears
 *
 *  // TODO(rmoutard) : make function to save space
 *  isGoogle, // true if it's a google service
 *  isGoogleMaps,
 *  isVimeo,
 *  isHttps, // true if protocol is https
 *  isYoutube;
 */

function UrlParser(sUrl) {
  var country_with_sub_domains = ['.uk'];

  try {
    // When a url is a parameter in an other url, then it has been
    // encodeURIComponents. To avoid problem decode it before using it.
    this.href = decodeURIComponent(sUrl);
    this.error = {
      'code': 0
    };
  } catch(oError) {
    // Sometimes the URL is mal formated so set the error and use unescape instead of
    // decodeURIComponent
    this.error = {
      'message': oError.message,
      'url': sUrl,
      'code': 1
    };
    try {
      //unescape twice because / becomes %2F and % becomes %25 so / becomes %252F
      this.href = unescape(unescape(sUrl));
    } catch(oError) {
      this.error = {
        'message': oError.message,
        'url': sUrl,
        'code': 2
      };
      this.href = sUrl;
    }
  }

  // split the URL by single-slashes to get the component parts
  var parts = this.href.replace('//', '/').split('/');
  // store the protocol and host
  this.protocol = parts[0];
  try {
    this.host = parts[1].split(':');

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
    this.hash = this.pathname.length > 1 ? this.pathname[1] : '';

    this.pathname = this.pathname[0];

    // SEARCH
    // extract any search query - delimited by '?' -
    this.pathname = this.pathname.split('?');
    this.search = this.pathname.length > 1 ? this.pathname[1] : '';

    this.pathname = this.pathname[0];

    var oGoogleRegExp = /www.google.[a-z]{2,3}|www.google.[a-z]{2,3}.[a-z]{2,3}/ig;
    this.isGoogle = (oGoogleRegExp.exec(this.hostname))? true : false;
    this.isGoogleMaps = (this.hostname_without_country === "maps.google"
                        || this.hostname_without_country === "maps.google.co"
                        || (this.isGoogle && this.pathname.match(/^\/maps/ig)));
    var oWikiRegExp = /[a-z]{2,3}.wikipedia.org/ig;
    this.isWikipedia = (this.hostname.match(oWikiRegExp)) ? true : false;
    this.isYoutube = (this.service === "youtube");
    this.isVimeo = (this.service === "vimeo");

    this.isHttps = (this.protocol === "https:");

    if(this.pathname === "/search"){
      this.generateKeywords();
      this.imageSearchPreviewSource();
    } else if (this.pathname === "/imgres"){
      this.imageSearchPreviewSource();
    } else if (this.pathname === "/search/fpsearch" || this.pathname === "/csearch/results"){
      this.generateLinkedInKeywords();
    }
  } catch(oError) {
    // special cases like about:blank (with no '/') break the install, because below we try
    // to split(':') parts[1] which doesn't exist.
    // an URIencoded url would also throw this error
    this.error = {
      'message': oError.message,
      'url': sUrl,
      'code': 3
    }
    return;
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
  var iLength = lHash.length;
  for ( var i = 0; i < iLength; i++) {
    var parameter = lHash[i].split('=');
    dHash[parameter[0]] = parameter[1];
  }
  this.dHash = dHash;

  // SEARCH
  var dSearch = {};
  // Extract parameters from the Search
  var lSearch = this.search.split('&');
  var iLength = lSearch.length;
  for ( var i = 0; i < iLength; i++) {
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
  var oSplitKeywordsRegExp = /%20|\ |\+/g;
  if (this.dHash['q'] !== undefined) {
    this.keywords = this.keywords.concat(this.dHash['q']
        .split(oSplitKeywordsRegExp));
  } else if (this.dSearch['q'] !== undefined) {
    this.keywords = this.keywords.concat(this.dSearch['q']
        .split(oSplitKeywordsRegExp));
  }

  // lower Case
  var iLength = this.keywords.length;
  for ( var j = 0; j < iLength; j++) {
    this.keywords[j] = unescape(unescape(this.keywords[j])).toLowerCase();
  }

};

UrlParser.prototype.generateLinkedInKeywords = function() {
  // KEYWORDS
  // Compute queries keywords - under q=key1+key2 -
  if (this.dSearch === undefined) {
    this.fineDecomposition();
  }
  this.keywords = [];

  // keywords can be separate by '+' or ' '
  // in a url caracters are escape so '+' of '%20'
  var oSplitKeywordsRegExp = new RegExp('%20|\\+', 'g');
  if (this.dSearch['keywords'] !== undefined) {
    this.keywords = this.keywords.concat(this.dSearch['keywords']
        .split(oSplitKeywordsRegExp));
  }
  // lower Case
  var iLength = this.keywords.length;
  for ( var j = 0; j < iLength; j++) {
    this.keywords[j] = unescape(unescape(this.keywords[j])).toLowerCase();
  }
};

UrlParser.prototype.imageSearchPreviewSource = function() {
 if (this.dSearch === undefined) {
    this.fineDecomposition();
  }
  if (this.dHash['imgrc'] && this.dHash['imgrc'] !== "_") {
    try {
      var sUnescaped = decodeURIComponent(this.dHash['imgrc']);
      this.searchImage = "http" + sUnescaped.split("http")[1].split(";")[0];
    } catch (oError) {
      this.error = {
        'message': oError.message,
        'code': 1
      }
    }
  } else if (this.dSearch['imgurl']) {
    this.searchImage = this.dSearch['imgurl'];
  }
};

UrlParser.prototype.replaceHexa = function(sEscaped) {
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
