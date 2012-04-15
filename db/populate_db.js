'use strict';

// This method is used during the installation to populate visitItem DB from
// chrome history visitItem database.
Cotton.DB.preRemoveTools = function(lVisitItems) {
  // Remove all the tools as mail.google.com, facebook.com.

  var oToolsContainer = generateTools(); // return a list of Tools
  var lCleanHistoryItems = new Array(); // Store the new list without tools

  // TODO(rmoutard) : use _.filter function in underscore library
  while (lVisitItems.length > 0) {
    var oVisitItem = lVisitItems.shift();
    var sHostname = new parseUrl(oVisitItem.url).hostname;

    // if hostname of the url is a Tool remove it
    if (oToolsContainer.alreadyExist(sHostname) === -1) {
      lCleanHistoryItems.push(oVisitItem);
    }
  }
  return lCleanHistoryItems;
};

Cotton.DB.populateDB = function(mCallBackFunction) {
  chrome.history.search({
    text : '',
    startTime : 0,
    maxResults : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    lHistoryItems = Cotton.DB.preRemoveTools(lHistoryItems);

    // TODO(rmoutard): Discuss if we can improve populate using all the
    // visitItem for each historyItem. For the moment we consider that an
    // historyItem is the lastVisitItem. Considering more is maybe a useless
    // complication.
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    var oStore = new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      console.log("store ready");
      for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
        var oVisitItem = new Cotton.Model.VisitItem();

        oVisitItem._sUrl = oHistoryItem.url;
        oVisitItem._sTitle = oHistoryItem.title || '';
        oVisitItem._iVisitTime = oHistoryItem.lastVisitTime;

        oStore.put('visitItems', oVisitItem, function(iId) {
          // TODO(rmoutard) : check that iId is really the id created by
          // auto-incremenation.
          iCount += 1;

          if (iCount === iPopulationLength) {
            mCallBackFunction.call();
          }
        });
      }
    });
  });
};
