'use strict';

// This method is used during the installation to populate visitItem DB from
// chrome history visitItem database.
Cotton.DB.preRemoveTools = function(lVisitItems) {
  // Remove all the tools as mail.google.com, facebook.com.

  console.debug('PreRemoveTools - Start');
  var oToolsContainer = new Cotton.Algo.ToolsContainer();
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
  console.debug('PreRemoveTools - After filtering it remains '
      + lCleanHistoryItems.length + ' items');
  console.debug('PreRemoveTools - End');
  return lCleanHistoryItems;
};

Cotton.DB.populateDB = function(mCallBackFunction) {
  // Get all the history items from Chrome DB.

  console.debug('PopulateDB - Start');

  chrome.history.search({
    text : '',
    startTime : 0,
    maxResults : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    console.debug('PopulateDB - chrome history search has returned '
      + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.preRemoveTools(lHistoryItems);

    // TODO(rmoutard): Discuss if we can improve populate using all the
    // visitItem for each historyItem. For the moment we consider that an
    // historyItem is the lastVisitItem. Considering more is maybe a useless
    // complication.
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    console.debug('PopulateDB - try to create new store');
    var oStore = new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      console.debug("PopulateDB - visitItems store ready");
      for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
        var oVisitItem = new Cotton.Model.VisitItem();

        oVisitItem._sUrl = oHistoryItem.url;
        oVisitItem._sTitle = oHistoryItem.title || '';
        oVisitItem._iVisitTime = oHistoryItem.lastVisitTime;

        oStore.put('visitItems', oVisitItem, function(iId) {
          console.debug('PopulateDB - visitItem added');
          iCount += 1;

          if (iCount === iPopulationLength) {
            console.debug('PopulateDB - End');
            mCallBackFunction.call();
          }
        });
      }
    });
  });
};
