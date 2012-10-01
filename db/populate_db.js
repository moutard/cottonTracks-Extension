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
  console.debug('New PreRemoveTools - Start');

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

  console.debug('PopulateDB - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    console.debug('PopulateDB - chrome history search has returned '
        + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);
    if (Cotton.UI.oCurtain) {
      Cotton.UI.oCurtain.increasePercentage(10);
    }

    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    console.debug('PopulateDB - try to create new store');
    new Cotton.DB.Store('ct', {
      'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      if (Cotton.UI.oCurtain) {
        Cotton.UI.oCurtain.increasePercentage(5);
      }
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
 *
 * @param :
 *          oStore
 * @param :
 *          mCallBackFunction
 */

Cotton.DB.Populate.visitItems = function(oStore, mCallBackFunction) {
  // Get all the history items from Chrome DB.
  console.debug('PopulateVisitItems - Start');
  var startTime1 = new Date().getTime();
  var elapsedTime1 = 0;

  chrome.history.search({
    text : '',
    startTime : 0,
    "maxResults" : Cotton.Config.Parameters.iMaxResult,
  }, function(lHistoryItems) {
    console.debug('PopulateVisitItems - chrome history search has returned '
        + lHistoryItems.length + ' items');
    lHistoryItems = Cotton.DB.Populate.preRemoveTools(lHistoryItems);

    console.debug('PopulateVisitItems - after preRemoveTools left : '
        + lHistoryItems.length + ' items');
    var iCount = 0;
    var iPopulationLength = lHistoryItems.length;

    for ( var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
      var oVisitItem = new Cotton.Model.VisitItem();

      oVisitItem.initUrl(oHistoryItem['url']);
      oVisitItem.setTitle(oHistoryItem['title']);
      oVisitItem.setVisitTime(oHistoryItem['lastVisitTime']);

      oStore.put('visitItems', oVisitItem, function(iId) {
        console.debug('PopulateVisitItems - visitItem added');
        iCount += 1;
        if (iCount === iPopulationLength) {
          console.debug('PopulateDB - End');
          elapsedTime1 = (new Date().getTime() - startTime1) / 1000;
          console.log('@@Time to PopulateStore : ' + elapsedTime1 + 's');
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
  console.debug('PopulateVisitItemsFromFile - Start');

  console.debug('PopulateVisitItems - import history file has returned '
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
      console.debug('PopulateVisitItems - visitItem added');
      iCount += 1;
      if (iCount === iPopulationLength) {
        console.debug('PopulateDB - End');
        mCallBackFunction(oStore);
      }
    });
  }
};
