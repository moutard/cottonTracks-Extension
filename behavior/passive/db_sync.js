'use strict';

var oCurrentHistoryItem = new HistoryItem(){};
oCurrentHistoryItem.getInfoFromPage();
/*chrome.history.search(
    { 'text': '',
      'maxResults': 1
    }, function(historyItems) {
      // Should return the last entry, i.e. the current page.
      console.log("last entry");
      console.log(historyItems);
    }
);*/
// error search can only be executed in extension runtime.
