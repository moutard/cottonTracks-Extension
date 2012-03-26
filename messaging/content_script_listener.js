// See below page for more informations.
// http://code.google.com/chrome/extensions/messaging.html

// Called when a message is passed.  We assume that the content script
function onRequest(request, sender, sendResponse) {

  console.log("background has received a message");
  console.log(request);

  //Cotton.DB.ManagementTools.listDB();
  // it seems request.historyItem is not an HistoryItem but just a dictionnary.
  var oHistoryItem = new Cotton.Model.HistoryItem();
  oHistoryItem.deserialize(request.historyItem);
  Cotton.DB.Pool.push(oHistoryItem);

  // Return nothing to let the connection be cleaned up.
  sendResponse({received: "true"});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

