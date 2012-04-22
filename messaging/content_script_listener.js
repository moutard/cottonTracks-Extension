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

  // TODO(rmoutard) : use DB system, or a singleton.
  var oToolsContainer = generateTools(); // return a list of Tools
  var sHostname = new parseUrl(oVisitItem._sUrl).hostname;
  var sPutId = "";
  // if hostname of the url is a Tool remove it
  if (oToolsContainer.alreadyExist(sHostname) === -1) {
    var oStore = new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      oStore.put('visitItems', oVisitItem, function(iId) {
        console.log("visitItem added");
        console.log(iId);
        sPutId = iId;
      });
    });
  }
  // Return nothing to let the connection be cleaned up.
  sendResponse({
    received : "true",
    id : sPutId,
  });
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
