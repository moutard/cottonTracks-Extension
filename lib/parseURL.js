//PU1.0 :: parseURL by brothercake - http://www.brothercake.com/

//parse a URL to form an object of properties
function parseURL(url)
{
    //save the unmodified url to href property
    //so that the object we get back contains
    //all the same properties as the built-in location object
    var loc = { 'href' : url };

    //split the URL by single-slashes to get the component parts
    var parts = url.replace('//', '/').split('/');

    //store the protocol and host
    loc.protocol = parts[0];
    loc.host = parts[1];

    //extract any port number from the host
    //from which we derive the port and hostname
    parts[1] = parts[1].split(':');
    loc.hostname = parts[1][0];
    loc.port = parts[1].length > 1 ? parts[1][1] : '';

    //splice and join the remainder to get the pathname
    parts.splice(0, 2);
    loc.pathname = '/' + parts.join('/');

    //extract any hash and remove from the pathname
    var dhash = {};
    loc.pathname = loc.pathname.split('#');
    if(loc.pathname.length > 1){
      loc.hash = loc.pathname.length > 1 ? '#' + loc.pathname[1] : '';
      
      // Extract parameters from the hash
      var lhash = loc.pathname[1].split('&');
      for(var i = 0; i < lhash.length; i++){
        var parameter = lhash[i].split('=');
        dhash[parameter[0]] = parameter[1];
      }
    }
    loc.dhash = dhash;
    
    loc.pathname = loc.pathname[0];

    //extract any search query and remove from the pathname
    loc.pathname = loc.pathname.split('?');
    loc.search = loc.pathname.length > 1 ? '?' + loc.pathname[1] : '';
    loc.pathname = loc.pathname[0];
    
    loc.keywords = ["key1", "key2"];
    //return the final object
    return loc;
}

function extractQ(sUrl){
  // Extract the keywords used to make the search on google 
  // http://www.google.fr/webhp?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=fr&gs_nf=1&cp=10&gs_id=3n&xhr=t&q=jennifer+aniston&pq=tets&pf=p&sclient=psy-ab&site=webhp&source=hp&pbx=1&oq=jennifer+a&aq=0&aqi=g4&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=6fc8c6804cede81f&ix=seb&ion=1&biw=1438&bih=727
  // q=jennifer+aniston
  
  // result
  var lKeywordsQueries = Array();
  var oRegExpExtractAllKeywords = new RegExp('(&|\\?)q=([a-zA-Z0-9\\+]*)&?', 'g');
  // http://www.google.com?q=key1+key2+key3 return ["?q=key1+key2+key3", "?", "key1+key2+key3"]
  
  var oRegExpResult = oRegExpExtractAllKeywords.exec(sUrl);
  if (oRegExpResult != null) {
    var sAllKeywords = oRegExpResult[2];
    
    var oRegExpExtractEachKeyword = new RegExp('([a-zA-Z0-9]+)\\+?','g');
    // key1+key2+key3 return ["key1+", "key1"]
    
    var lExtractedKeyword = oRegExpExtractEachKeyword.exec(sAllKeywords);
    
    while (lExtractedKeyword != null) {
      lKeywordsQueries.push(lExtractedKeyword[1]);
      lExtractedKeyword = oRegExpExtractEachKeyword.exec(sAllKeywords);
    }
    
  }
  return lKeywordsQueries;
  
}