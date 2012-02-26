function removeTools(lHistoryItems) {
  var oToolsContainer = generateTools();
  var lCleanHistoryItems = new Array();

  for ( var i = 0; i < lHistoryItems.length; i++) {
    var oHistoryItem = lHistoryItems.shift();
    var sHostname = parseUrl(oHistoryItem.url).hostname;

    if (oToolsContainer.alreadyExist(sHostname) === -1) {
      lCleanHistoryItems.push(oHistoryItem);
    }
  }

  return lCleanHistoryItems;
}

function computeClosestGeneratedPage(lHistoryItems) {

  var iSliceTime = 1000 * 60 * 5;
  var sNonFound = "http://www.google.fr/";
  var oCurrentSearchPage = {
    url : "http://www.google.fr/",
    lastVisitTime : 0
  };

  for ( var i = lHistoryItems.length - 1; i >= 0; i--) {
    // parcours inverse
    // this method is working because lHistoryItems is sorted by lastVisitTime
    if (parseUrl(lHistoryItems[i].url).pathname === "/search") {
      oCurrentSearchPage = lHistoryItems[i];
      lHistoryItems[i].closestGeneratedPage = lHistoryItems[i].url;
    } else {
      if (Math.abs(oCurrentSearchPage.lastVisitTime
          - lHistoryItems[i].lastVisitTime) <= iSliceTime) {
        lHistoryItems[i].closestGeneratedPage = oCurrentSearchPage.url;
      } else {
        lHistoryItems[i].closestGeneratedPage = sNonFound;
      }
    }
  }

  return lHistoryItems;
}
