// Tools

function extractWords(sTitle) {
  // We cannot use the \b boundary symbol in the regex because accented
  // characters would not be considered (not art of \w).
  // Include all normal characters, dash, accented characters.
  // TODO(fwouts): Consider other characters such as digits?
  var oRegexp = /[\w\-\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
  var lMatches = sTitle.match(oRegexp) || [];
  // TODO(fwouts): Be nicer on the words we keep, but still reject useless words
  // such as "-".
  lMatches = $.grep(lMatches, function(sWord) {
    return sWord.length > 2;
  });
  return lMatches;
}

function commonWords(oHistoryItem1, oHistoryItem2) {
  // Return the number of common words

  var iTitleWordsAmount = 0;
  var lWords1 = extractWords(oHistoryItem1.title);
  var lWords2 = extractWords(oHistoryItem2.title);

  var dWords1 = {};
  for ( var iI = 0, iN = lWords1.length; iI < iN; iI++) {
    var sWord = lWords1[iI];
    dWords1[sWord] = true;
  }
  for ( var iI = 0, iN = lWords2.length; iI < iN; iI++) {
    var sWord = lWords2[iI];
    if (dWords1[sWord]) {
      // The word is resent in both.
      iTitleWordsAmount++;
      // Do not count it twice.
      delete dWords1[sWord];
    }
  }

  return iTitleWordsAmount;
}

function distance(oHistoryItem1, oHistoryItem2) {
  // compute distance between two historyItems

}

function distanceId(oHistoryItem1, oHistoryItem2) {
  // compute the Id distance
  return Math.abs(parseInt(oHistoryItem1.id) - parseInt(oHistoryItem2.id));
}

function distanceLastVisitTime(oHistoryItem1, oHistoryItem2) {
  // compute the last visit distance
  return Math.abs(oHistoryItem1.lastVisitTime - oHistoryItem2.lastVisitTime);
}

// TODO(rmoutard) : Write a better distance, maybe to keep it between [0,1]
// for instance you need to balance common words
function distanceComplexe(oHistoryItem1, oHistoryItem2) {

  // TODO: (rmoutard) write a class for coefficients
  var coeff = {};
  coeff['id'] = 0.10;
  coeff['lastVisitTime'] = 0.35;
  coeff['commonWords'] = 0.35;
  coeff['queryKeywords'] = 0.20;

  // id
  // id close => items close
  // ordre de grandeur = O(1000)
  var sum = coeff['id']
      * Math.abs(parseInt(oHistoryItem1.id) - parseInt(oHistoryItem2.id));

  // lastTimeVisit
  // lastTimeVisit close => items close
  // ordre de grandeur = O(100 000)
  sum += coeff['lastVisitTime']
      * Math.abs(oHistoryItem1.lastVisitTime - oHistoryItem2.lastVisitTime);

  // Common words
  // number of common words is high => items close
  // ordre de grandeur = O(5)
  sum += coeff['commonWords'] * 100000
      / ((1 + commonWords(oHistoryItem1, oHistoryItem2)) ^ 2);

  // Query keywords
  // TODO(rmoutard) : pass lHistoryItems or use lHistoryItems as singleton
  // sum += coeff['queryKeywords']
  // * distanceBetweenGeneratedPages(oHistoryItem1, oHistoryItem2,
  // lHistoryItems)
  return sum;
}

/*
 * Distance between generated pages
 */
function getClosestGeneratedPage(oHistoryItem) {
  // TODO(rmoutard) : I think there is a better way to find it
  var endTime = oHistoryItem.lastVisitTime;
  var startTime = endTime - 1000 * 60 * 5;
  chrome.history.search({
    'text' : '',
    'startTime' : startTime,
    'endTime' : endTime
  }, function(lHistoryItems) {
    bFlagReady = true;
    console.log("getClosestGeneratedPages with");
    console.log("oHistoryItem :");
    console.log(oHistoryItem);
    console.log("Result :");
    // console.log(lHistoryItems);

    // TODO(rmoutard) : return something when there is no result
    for ( var i = 0; i < lHistoryItems.length; i++) {
      var oUrl = parseUrl(lHistoryItems[i].url);
      if (oUrl.pathname === "/search") {
        console.log(lHistoryItems[i]);
        return lHistoryItems[i];
      }
    }

    var oEmpty = {
      url : 'http://google.com'
    };
    return oEmpty;

  });

}
function getClosestGeneratedPage(oHistoryItem, lHistoryItems) {
  // TODO(rmoutard) : maybe use lHistoryItems as a singleton
  // TODO(rmoutard) : I think there is a better way to find it

  var sliceTime = 1000 * 60 * 5;
  var endTime = oHistoryItem.lastVisitTime;

  // lHistoryItems is sorted by id ?
  var oClosestGeneratedPage = {
    url : 'http://google.com'
  };

  var lowerGapTime = sliceTime;
  for ( var i = 0; i < lHistoryItems.length; i++) {
    var currentGapTime = Math.abs(endTime - lHistoryItems[i].lastVisitTime);
    if (currentGapTime <= sliceTime) {
      // the historyItem can be considered
      var oUrl = parseUrl(lHistoryItems[i].url);
      if (oUrl.pathname === "/search" && currentGapTime < lowerGapTime) {
        oClosestGeneratedPage = lHistoryItems[i];
      }
    }
  }
  return oClosestGeneratedPage;
}

function distanceBetweenGeneratedPages(oHistoryItem1, oHistoryItem2,
    lHistoryItems) {

  var oGeneratedPage1 = getClosestGeneratedPage(oHistoryItem1, lHistoryItems);
  var oGeneratedPage2 = getClosestGeneratedPage(oHistoryItem2, lHistoryItems);

  var keywords1 = parseUrl(oGeneratedPage1.url).keywords;
  var keywords2 = parseUrl(oGeneratedPage2.url).keywords;

  var result = _.intersection(keywords1, keywords2);
  return result.length;
}

/*
 * HistoryItem An object encapsulating one result of a history query.
 * 
 * id ( string ) The unique identifier for the item. url ( optional string ) The
 * URL navigated to by a user. title ( optional string ) The title of the page
 * when it was last loaded. lastVisitTime ( optional number ) When this page was
 * last loaded, represented in milliseconds since the epoch. visitCount (
 * optional integer ) The number of times the user has navigated to this page.
 * typedCount ( optional integer ) The number of times the user has navigated to
 * this page by typing in the address.
 */

/*
 * Url generated by google q=jennifer+aniston& // query
 * pq=tets&pf=p&sclient=psy-ab& //previous query site=webhp&source=hp&pbx=1&
 * oq=jennifer+a& // auto completion
 * aq=0&aqi=g4&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=6fc8c6804cede81f&ix=seb&ion=1&biw=1438&bih=727
 */
