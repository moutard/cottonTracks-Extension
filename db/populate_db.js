'use strict';

/**
 * PopulateDB
 *
 * A group of method used during the installation to populate visitItem DB from
 * chrome history visitItem database.
 */

Cotton.DB.Populate = {};

/**
 * PreRemoveTools
 * @param: list of serialized visitItems. (see chrome api for more informations)
 * remove visitItems that are https, or that are tools.
 */
Cotton.DB.Populate.preRemoveTools = function(lVisitItems) {
  console.debug('New PreRemoveTools - Start');
  var oToolsContainer = new Cotton.Algo.ToolsContainer();

  return _.filter(lVisitItems, function(dVisitItem) {
    var oUrl = new parseUrl(dVisitItem.url);
    var sHostname = oUrl.hostname;
    var sProtocol = oUrl.protocol;
    return !((sProtocol === "https:" && !oUrl.isGoogle) || oToolsContainer
        .isTool(sHostname));
  });
};

/**
 * Populate the database using the chrome history database
 * @param : mCallBackFunction
 */
Cotton.DB.Populate.start = function(mCallBackFunction) {

  console.debug('PopulateDB - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    maxResults : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    console.debug('PopulateDB - chrome history search has returned '
        + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);

    // TODO(rmoutard): Discuss if we can improve populate using all the
    // visitItem for each historyItem. For the moment we consider that an
    // historyItem is the lastVisitItem. Considering more is maybe a useless
    // complication.
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    console.debug('PopulateDB - try to create new store');
    new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      console.debug("PopulateDB - visitItems store ready");
      for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
        var oVisitItem = new Cotton.Model.VisitItem();

        oVisitItem._sUrl = oHistoryItem.url;
        oVisitItem._sTitle = oHistoryItem.title || '';
        oVisitItem._iVisitTime = oHistoryItem.lastVisitTime;

        this.put('visitItems', oVisitItem, function(iId) {
          console.debug('PopulateDB - visitItem added');
          iCount += 1;

          if (iCount === iPopulationLength) {
            console.debug('PopulateDB - End');
            elapsedTime1 = (new Date().getTime() - startTime1) / 1000;
            console.log('@@Time to PopulateDB : ' + elapsedTime1 + 's');
            mCallBackFunction.call();
          }
        });
      }
    });
  });
};

/**
 * Populate visitItems with a given store. (faster than the previous)
 * @param : oStore
 * @param : mCallBackFunction
 */

Cotton.DB.Populate.visitItems = function(oStore, mCallBackFunction) {
  // Get all the history items from Chrome DB.
  var self = this;
  console.debug('PopulateVisitItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    maxResults : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    console.debug('PopulateVisitItems - chrome history search has returned '
        + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);

    // TODO(rmoutard): Discuss if we can improve populate using all the
    // visitItem for each historyItem. For the moment we consider that an
    // historyItem is the lastVisitItem. Considering more is maybe a useless
    // complication.
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
      var oVisitItem = new Cotton.Model.VisitItem();

      oVisitItem._sUrl = oHistoryItem.url;
      oVisitItem._sTitle = oHistoryItem.title || '';
      oVisitItem._iVisitTime = oHistoryItem.lastVisitTime;

      oStore.put('visitItems', oVisitItem, function(iId) {
        console.debug('PopulateVisitItems - visitItem added');
        iCount += 1;
        if (iCount === iPopulationLength) {
          console.debug('PopulateDB - End');
          elapsedTime1 = (new Date().getTime() - startTime1) / 1000;
          console.log('@@Time to PopulateStore : ' + elapsedTime1 + 's');
          mCallBackFunction.call(self, oStore);
        }
      });
    }
  });
};
