'use strict';

/**
 * PopulateDB
 *
 * A group of method used during the installation to populate historyItem DB from
 * chrome history historyItem database.
 */

Cotton.DB.Populate = {};

/**
 * PreRemoveTools
 *
 * @param: list of serialized historyItems. (see chrome api for more informations)
 *         remove historyItems that are https, or that are tools.
 */
Cotton.DB.Populate.preRemoveTools = function(lHistoryItems) {
  DEBUG && console.debug('New PreRemoveTools - Start');

  var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

  return _.reject(lHistoryItems, function(dHistoryItem) {
    return (oExcludeContainer.isExcluded(dHistoryItem['url']));
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
      'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
    }, function() {
      if (Cotton.UI.oCurtain) {
        Cotton.UI.oCurtain.increasePercentage(5);
      }
      DEBUG && console.debug("PopulateDB - historyItems store ready");
      for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
        var oHistoryItem = new Cotton.Model.HistoryItem();

        oHistoryItem._sUrl = oHistoryItem.url;
        oHistoryItem._sTitle = oHistoryItem.title || '';
        oHistoryItem._iVisitTime = oHistoryItem.lastVisitTime;

        this.put('historyItems', oHistoryItem, function(iId) {
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
 * Populate historyItems with a given store. (faster than the previous)
 *
 * @param :
 *          oDatabase
 * @param :
 *          mCallBackFunction
 */

Cotton.DB.Populate.historyItems = function(oDatabase, mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateHistoryItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    DEBUG && console.debug('PopulateHistoryItems - chrome history search has returned '
        + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);

    DEBUG && console.debug('PopulateHistoryItems - after preRemoveTools left : '
        + lHistoryItems.length + ' items');
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    for ( var i = 0, oChromeHistoryItem; oChromeHistoryItem = lHistoryItems[i]; i++) {
      // distinction between oIDBHistoryItem and oChromeHistoryItem
      var oIDBHistoryItem = new Cotton.Model.HistoryItem();

      oIDBHistoryItem.initUrl(oChromeHistoryItem['url']);
      oIDBHistoryItem.setTitle(oChromeHistoryItem['title']);
      oIDBHistoryItem.setVisitTime(oChromeHistoryItem['lastVisitTime']);
      oDatabase.put('historyItems', oIDBHistoryItem, function(iId) {
        iCount += 1;
        if (iCount === iPopulationLength) {
          elapsedTime1 = (new Date().getTime() - startTime1) / 1000;
          DEBUG && console.debug('PopulateDB end with time : ' + elapsedTime1 + 's');
          mCallBackFunction(oDatabase);
        }
      });
    }
  });
};

/**
 * Populate historyItems with a given store, without using chrome history, but
 * given data.
 *
 * @param :
 *          oDatabase
 * @param :
 *          lHistoryItems
 * @param :
 *          mCallBackFunction
 */

Cotton.DB.Populate.historyItemsFromFile = function(oDatabase, lHistoryItems,
    mCallBackFunction) {
  // Get all the history items from Chrome DB.
  DEBUG && console.debug('PopulateHistoryItemsFromFile - Start');

  DEBUG && console.debug('PopulateHistoryItems - import history file has returned '
      + lHistoryItems.length + ' items');
  lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);

  var iCount = 0;
  var iPopulationLength = lHistoryItems.length;

  for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
    var oHistoryItem = new Cotton.Model.HistoryItem();

    oHistoryItem.initUrl(oHistoryItem['url']);
    oHistoryItem.setTitle(oHistoryItem['title']);
    oHistoryItem.setVisitTime(oHistoryItem['lastVisitTime']);

    oDatabase.put('historyItems', oHistoryItem, function(iId) {
      iCount += 1;
      if (iCount === iPopulationLength) {
        DEBUG && console.debug('PopulateDB - End');
        mCallBackFunction(oDatabase);
      }
    });
  }
};
