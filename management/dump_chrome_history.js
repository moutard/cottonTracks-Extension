/**
 * Return the elements of the chrome history items for a given date.
 * This date corresponds to a period where we were browsing normally.
 * @param function
 */
Cotton.Management.dumpChromeHistoryRaw = function(mActionWithItems){
  chrome.history.search({
    text : '',
    startTime : 0,
    // january 20th 23:59:59s and before
    //endTime : 1358726399000,
    // take enough to be sure that we'll have at least 1000 left after preRemoveTools
    "maxResults" : 5000,
  }, function(lChromeHistoryItems) {
    mActionWithItems(lChromeHistoryItems);
  });
};

Cotton.Management.dumpChromeVisitItemsRaw = function() {
    var lAllVisitItems = [];
    var iCount = 0;
    var iChromeHistoryLength = 0;
    chrome.history.search({
    text : '',
    startTime : 0,
    // january 20th 23:59:59s and before
    //endTime : 1358726399000,
    // take enough to be sure that we'll have at least 1000 left after preRemoveTools
    "maxResults" : 800,
  }, function(lChromeHistoryItems) {
    //var sRecord = JSON.stringify(lChromeHistoryItems);
    //var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
    //window.open(sUriContent, 'chrome_history_item_raw');

    iChromeHistoryLength = lChromeHistoryItems.length;
    for (var i = 0; i < iChromeHistoryLength; i++ ) {
      var dHistoryItem = lChromeHistoryItems[i];
      chrome.history.getVisits({
        'url': dHistoryItem['url']
      }, function(lVisitItems) {

        lAllVisitItems = lAllVisitItems.concat(lVisitItems);
        iCount++;
        if (iCount == iChromeHistoryLength) {
          var sRecord = JSON.stringify(lAllVisitItems);
          var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
          window.open(sUriContent, 'chrome_visit_item_raw');
        }
      });
    }

  });

 };
/**
 * Return the chrome elements after they have been translate to cotton history
 * item, and the pretreatment suite have been applied. Like exlude
 * https or tools, and generate closest google search page.
 */
Cotton.Management.dumpChromeHistoryWithPretreatmentSuite = function(mActionWithItems) {
  // Number of history we want.
  var iNumberOfHistoryItem = 1000;

  Cotton.Management.dumpChromeHistoryRaw(function(lChromeHistoryItems){
    var lHistoryItems = Cotton.Core.Populate.Suite(lHistoryItems);
    mActionWithItems(lHistoryItems.slice(0, iNumberOfHistoryItem));
  });
};

/**
 * Dump the chrome history in it's raw version in a file.
 */
Cotton.Management.dumpChromeHistoryRawInFile = function () {
  Cotton.Management.dumpChromeHistoryRaw(function(lChromeHistoryItems){
    var sRecord = JSON.stringify(lChromeHistoryItems);
    var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
    window.open(sUriContent, 'chrome_history_source_yourname');
  });
};

/**
 * Dump the chrome history after pretreatment suite in a file.
 */
Cotton.Management.dumpChromeHistoryWithPretreatmentSuite = function () {
  Cotton.Management.dumpChromeHistoryWithPretreatmentSuite(
      function(lChromeHistoryItems){
        var sRecord = JSON.stringify(lChromeHistoryItems);
        var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
        window.open(sUriContent, 'cotton_history_source_yourname');
  });
};

/**
 * Return the elements of the chrome history items for a given date.
 * This date corresponds to a period where we were browsing normally.
 * @param function
 */
Cotton.Management.dumpChromeVisitHistoryRaw = function(mActionWithItems) {
  Cotton.Core.Populate.visitItems(undefined, function(lChromeHistoryItems){
    var sRecord = JSON.stringify(lChromeHistoryItems);
    var blob = new Blob([sRecord], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "chrome_visit_source_yourname.js");
  });
 };

