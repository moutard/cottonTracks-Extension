'use strict';

$(document).ready(function() {
  var oCurrentVisitItem = new Cotton.Model.VisitItem();
  oCurrentVisitItem.getInfoFromPage();
  console.log(oCurrentVisitItem);

  chrome.extension.sendRequest({
  visitItem : oCurrentVisitItem
    }, function(response) {
      console.log(response);
  });

});

// According to Chrome API, the object oCurrentHistoryItem will
// be serialized.


// CHROME TABS API
//
// chrome.tabs.getCurrent(function(oTab){console.log(oTab);})
// can't be used outside the extension context. But could b very usefull.
