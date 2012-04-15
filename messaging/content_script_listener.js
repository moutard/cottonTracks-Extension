// See below page for more informations.
// http://code.google.com/chrome/extensions/messaging.html

// Called when a message is passed.  We assume that the content script
function onRequest(request, sender, sendResponse) {

  console.log("background has received a message");
  console.log(request);

  // Cotton.DB.ManagementTools.listDB();
  // it seems request.historyItem is not an HistoryItem but just a dictionnary.
  var oVisitItem = new Cotton.Model.VisitItem();
  oVisitItem.deserialize(request.visitItem);
  // Cotton.DB.Pool.push(oVisitItem);
  var oStore = new Cotton.DB.Store('ct', {
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
  }, function() {
    oStore.put('visitItems', oVisitItem, function(iId) {
      console.log("visitItem added");
      console.log(iId);
    });

  });
  // Return nothing to let the connection be cleaned up.
  sendResponse({
    received : "true"
  });
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
