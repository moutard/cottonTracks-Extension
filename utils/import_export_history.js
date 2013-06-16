'use strict';

Cotton.Utils.exportHistory = function(mCallBack) {
  // Export the history in the JSON.
  chrome.history.search({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.dbscan3.iMaxResult,
  }, function(lHistoryItems) {
    console.debug('Export History - chrome history search has returned '
        + lHistoryItems.length + ' items');
    var oHistory = {
      'lHistoryItems' : lHistoryItems,
    };
    var sHistory = JSON.stringify(oHistory);
    mCallBack(sHistory);
  });
};

Cotton.Utils.importHistory = function(sHistoryBlob) {
  var oHistory = JSON.parse(sHistoryBlob);

   chrome.runtime.sendMessage({
      'action': 'import_history',
      'params': {
        'history': oHistory
      }
    }, function(response) {
      DEBUG && console.debug(response);
      DEBUG && console.debug("import history has been done");
    });

};
