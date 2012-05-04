// See below page for more informations.
// http://code.google.com/chrome/extensions/messaging.html

// Called when a message is passed.  We assume that the content script
function onRequest(request, sender, sendResponse) {

  console.log(request);

  // request.historyItem is serialized by the sender. So it's just
  // a dictionary. We need to deserialized it before putting it in the DB.
  var oVisitItem = new Cotton.Model.VisitItem();
  oVisitItem.deserialize(request.visitItem);

  // TODO(rmoutard) : use DB system, or a singleton.
  var oToolsContainer = generateTools(); // return a list of Tools
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

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
