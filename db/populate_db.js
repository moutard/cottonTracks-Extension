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
 *
 * @param: list of serialized visitItems. (see chrome api for more informations)
 *         remove visitItems that are https, or that are tools.
 */
Cotton.DB.Populate.preRemoveTools = function(lVisitItems) {
  DEBUG && console.debug('New PreRemoveTools - Start');

  var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

  return _.reject(lVisitItems, function(dVisitItem) {
    return (oExcludeContainer.isExcluded(dVisitItem['url']));
  });
};

/**
 * Populate the database using the chrome history database
 *
 * @param :
 *          mCallBackFunction
 */
Cotton.DB.Populate.start = function(mCallBackFunction) {

  DEBUG && console.debug('PopulateDB - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    DEBUG && console.debug('PopulateDB - chrome history search has returned '
        + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);
    if (Cotton.UI.oCurtain) {
      Cotton.UI.oCurtain.increasePercentage(10);
    }

    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    DEBUG && console.debug('PopulateDB - try to create new store');
    new Cotton.DB.IndexedDB.Wrapper('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      if (Cotton.UI.oCurtain) {
        Cotton.UI.oCurtain.increasePercentage(5);
      }
      DEBUG && console.debug("PopulateDB - visitItems store ready");
      for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
        var oVisitItem = new Cotton.Model.VisitItem();

        oVisitItem._sUrl = oHistoryItem.url;
        oVisitItem._sTitle = oHistoryItem.title || '';
        oVisitItem._iVisitTime = oHistoryItem.lastVisitTime;

        this.put('visitItems', oVisitItem, function(iId) {
          iCount += 1;

          if (iCount === iPopulationLength) {
            elapsedTime1 = (new Date().getTime() - startTime1) / 1000;
            DEBUG && console.log('PopulateDB end with time : ' + elapsedTime1 + 's');
            mCallBackFunction.call();
          }
        });
      }
    });
  });
};

/**
 * Populate visitItems with a given store. (faster than the previous)
 *
 * @param :
 *          oStore
 * @param :
 *          mCallBackFunction
 */

Cotton.DB.Populate.visitItems = function(oStore, mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateVisitItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    DEBUG && console.debug('PopulateVisitItems - chrome history search has returned '
        + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);

    DEBUG && console.debug('PopulateVisitItems - after preRemoveTools left : '
        + lHistoryItems.length + ' items');
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
      var oVisitItem = new Cotton.Model.VisitItem();

      oVisitItem.initUrl(oHistoryItem['url']);
      oVisitItem.setTitle(oHistoryItem['title']);
      oVisitItem.setVisitTime(oHistoryItem['lastVisitTime']);

      oStore.put('visitItems', oVisitItem, function(iId) {
        iCount += 1;
        if (iCount === iPopulationLength) {
          elapsedTime1 = (new Date().getTime() - startTime1) / 1000;
          DEBUG && console.debug('PopulateDB end with time : ' + elapsedTime1 + 's');
          mCallBackFunction(oStore);
        }
      });
    }
  });
};

/**
 * Populate visitItems with a given store, without using chrome history, but
 * given data.
 *
 * @param :
 *          oStore
 * @param :
 *          lHistoryItems
 * @param :
 *          mCallBackFunction
 */

Cotton.DB.Populate.visitItemsFromFile = function(oStore, lHistoryItems,
    mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateVisitItemsFromFile - Start');

  DEBUG && console.debug('PopulateVisitItems - import history file has returned '
      + lHistoryItems.length + ' items');
  lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);

  var iCount = 0;
  var iPopulationLength = lHistoryItems.length;

  for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
    var oVisitItem = new Cotton.Model.VisitItem();

    oVisitItem.initUrl(oHistoryItem['url']);
    oVisitItem.setTitle(oHistoryItem['title']);
    oVisitItem.setVisitTime(oHistoryItem['lastVisitTime']);

    oStore.put('visitItems', oVisitItem, function(iId) {
      iCount += 1;
      if (iCount === iPopulationLength) {
        DEBUG && console.debug('PopulateDB - End');
        mCallBackFunction(oStore);
      }
    });
  }
};
