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
    endTime : 1358726399000,
    // take enough to be sure that we'll have at least 1000 left after preRemoveTools
    "maxResults" : 5000,
  }, function(lChromeHistoryItems) {
    mActionWithItems(lChromeHistoryItems);
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
    var lHistoryItems = Cotton.DB.Populate.Suite(lHistoryItems);
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
