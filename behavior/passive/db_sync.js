'use strict';
// DB_SYNC.
// Each time a new tab is opened, a visitItem is created. Then send to the
// content_script_listener. That will put it in the database.

var oCurrentVisitItem = new Cotton.Model.VisitItem();

$(document).ready(function() {
  // Need to wait the document is ready to get the title.

  oCurrentVisitItem.getInfoFromPage();

  chrome.extension.sendRequest({
    visitItem : oCurrentVisitItem
      }, function(response) {
        console.log(response);
        oCurrentVisitItem._sId = response.id;
        console.log(oCurrentVisitItem);
  });

});

// According to Chrome API, the object oCurrentHistoryItem will
// be serialized.


// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){console.log(oTab);})
// can't be used outside the extension context. But could b very usefull.
