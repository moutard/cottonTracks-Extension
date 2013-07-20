
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

  //escape twice because / becomes %2F and % becomes %25 so / becomes %252F
  sUrl = unescape(unescape(sUrl));
  this.href = sUrl;
  try {
    // When a url is a parameter in an other url, then it has been
    // encodeURIComponents. To avoid problem decode it before using it.
    this.href = decodeURIComponent(sUrl);

    // split the URL by single-slashes to get the component parts
    var parts = this.href.replace('//', '/').split('/');

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

    var oGoogleRegExp = /www.google.[a-z]{2,3}|www.google.[a-z]{2,3}.[a-z]{2,3}/ig;
    this.isGoogle = (oGoogleRegExp.exec(this.hostname))? true : false;
    this.isGoogleMaps = (this.hostname_without_country === "maps.google"
                        || this.hostname_without_country === "maps.google.co"
                        || (this.isGoogle && this.pathname.match(/^\/maps/ig)));
    var oWikiRegExp = /[a-z]{2,3}.wikipedia.org/ig;
    this.isWikipedia = (this.hostname.match(oWikiRegExp)) ? true : false;
    this.isYoutube = (this.hostname === "www.youtube.com");
    this.isVimeo = (this.hostname_without_country === "vimeo");

    this.isHttps = (this.protocol === "https:");

    if(this.pathname === "/search"){
      this.generateKeywords();
      this.genericSearch();
      this.imageSearchPreviewSource();
    } else if (this.pathname === "/imgres"){
      this.imageSearchPreviewSource();
    } else if (this.pathname === "/search/fpsearch" || this.pathname === "/csearch/results"){
      this.generateLinkedInKeywords();
    }
  } catch(e) {
    // Sometimes the URL is mal formated.
    this.error = e.message;
    return 1;
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
  var oSplitKeywordsRegExp = /%20|\ |\+/g;
  if (this.dHash['q'] !== undefined) {
    this.keywords = this.keywords.concat(this.dHash['q']
        .split(oSplitKeywordsRegExp));
  } else if (this.dSearch['q'] !== undefined) {
    this.keywords = this.keywords.concat(this.dSearch['q']
        .split(oSplitKeywordsRegExp));
  }

  // lower Case
  for ( var j = 0, iLength = this.keywords.length; j < iLength; j++) {
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
  for ( var j = 0, iLength = this.keywords.length; j < iLength; j++) {
    this.keywords[j] = unescape(unescape(this.keywords[j])).toLowerCase();
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
 if (this.dSearch === undefined) {
    this.fineDecomposition();
  }
  if (this.dHash['imgrc'] && this.dHash['imgrc'] !== "_"){
    var sUnescaped = unescape(unescape(this.dHash['imgrc']));
    this.searchImage = "http" + sUnescaped.split("http")[1].split(";")[0];
  } else if (this.dSearch['imgurl']){
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


function accentTidy(sWord){
  var sAccentTidy = sWord.toLowerCase();
  sAccentTidy = sAccentTidy.replace(new RegExp("[àáâãäå]", 'g'),"a");
  sAccentTidy = sAccentTidy.replace(new RegExp("æ", 'g'),"ae");
  sAccentTidy = sAccentTidy.replace(new RegExp("ç", 'g'),"c");
  sAccentTidy = sAccentTidy.replace(new RegExp("[èéêë]", 'g'),"e");
  sAccentTidy = sAccentTidy.replace(new RegExp("[ìíîï]", 'g'),"i");
  sAccentTidy = sAccentTidy.replace(new RegExp("ñ", 'g'),"n");
  sAccentTidy = sAccentTidy.replace(new RegExp("[òóôõöő]", 'g'),"o");
  sAccentTidy = sAccentTidy.replace(new RegExp("œ", 'g'),"oe");
  sAccentTidy = sAccentTidy.replace(new RegExp("[ùúûüű]", 'g'),"u");
  sAccentTidy = sAccentTidy.replace(new RegExp("[ýÿ]", 'g'),"y");
  return sAccentTidy;
};
// README
// This system is principaly designed for google search. it maybe interesting
// to see if 'bing', 'yahoo', or 'duckduckgo' have the same conventions.
// Extract q (keywords queries) can give an important information about a story.
// Extract aq (keywords queries you did just before the current query). Should
// be very pertinent to join two queries.
