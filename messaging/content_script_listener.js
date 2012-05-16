'use strict';

// See below page for more informations.
// http://code.google.com/chrome/extensions/messaging.html

// Called when a message is passed.  We assume that the content script
function onRequest(request, sender, sendResponse) {
  
  console.log(request);
  
  switch (request.action) {
  case 'create_visit_item':
    // request.historyItem is serialized by the sender. So it's just
    // a dictionary. We need to deserialized it before putting it in the DB.
    var oVisitItem = new Cotton.Model.VisitItem();
    oVisitItem.deserialize(request.params.visitItem);
    
    // Compute the referer id as it should be returned by the Chrome Extension
    // History API. We need this algorithm because in some cases, such as when
    // you open a link in a new tab, the referer id is not filled by Chrome, so
    // we need to fill it ourselves.
    // TODO(fwouts): Move out of here.
    
    var mGetVisitsHandler = function(lChromeReferrerVisitItems) {
      // Select the last one the visit items.
      if (lChromeReferrerVisitItems && lChromeReferrerVisitItems.length > 0) {
        var iIndex = lChromeReferrerVisitItems.length - 1;
        var oReferrerVisitItem = lChromeReferrerVisitItems[iIndex];
        // Update the visit item accordingly.
        oVisitItem.setChromeReferringVisitId(oReferrerVisitItem.visitId);
      }
      
      // Other processing following this.
      
      // TODO(rmoutard) : use DB system, or a singleton.
      var oToolsContainer = new Cotton.Algo.ToolsContainer(); // return a list of Tools
      var sHostname = new parseUrl(oVisitItem._sUrl).hostname;
      var sPutId = ""; // put return the auto-incremented id in the database.

      // Put the visitItem only if it's not a Tool.
      if (oToolsContainer.alreadyExist(sHostname) === -1) {
        var oStore = new Cotton.DB.Store('ct', {
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
        }, function() {
          oStore.put('visitItems', oVisitItem, function(iId) {
            console.log("visitItem added");
            console.log(iId);
            sPutId = iId;

            // Return nothing to let the connection be cleaned up.
            sendResponse({
              received : "true",
              id : sPutId,
            });

          });
        });
      }
    };
    
    var sReferringUrl = oVisitItem.referrerUrl();
    if (sReferringUrl) {
      chrome.history.getVisits({
        url: sReferringUrl
      }, mGetVisitsHandler);
    } else {
      mGetVisitsHandler([]);
    }
    
    break;
  }

 };

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
