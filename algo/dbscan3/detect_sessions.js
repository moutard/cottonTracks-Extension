'use strict';

/**
 * separate roughly the historyItems when the time difference between two
 * consecutive items is more than 5 hours.
 *
 * @param {Array}
 *          lHistoryItems
 */

Cotton.Algo.roughlySeparateSession = function(lHistoryItems, mCallBack) {
  // 5 hours
  var threshold = 5 * 60 * 60 * 1000;

  var lNewRoughSession = [];
  var iPreviousTime;

  for ( var i = 0, oCurrentHistoryItem; oCurrentHistoryItem = lHistoryItems[i]; i++) {
    if (i === 0) {
      iPreviousTime = oCurrentHistoryItem['iLastVisitTime'];
    }
    // var a = new Date(iPreviousTime).toLocaleString();
    // var b = new Date(oCurrentHistoryItem['iLastVisitTime']).toLocaleString();

    if (Math.abs(oCurrentHistoryItem['iLastVisitTime'] - iPreviousTime) <= threshold) {
      lNewRoughSession.push(oCurrentHistoryItem);
    } else {
      mCallBack(lNewRoughSession);
      lNewRoughSession = [];
      lNewRoughSession.push(oCurrentHistoryItem);
    }
    iPreviousTime = oCurrentHistoryItem['iLastVisitTime'];

  }

  mCallBack(lNewRoughSession);
};

Cotton.Algo.roughlySeparateSessionForVisitItems = function(lHistoryItems, lChromeVisitItems,
    mCallBack) {
  // 5 hours
  var threshold = 5 * 60 * 60 * 1000;

  var lNewRoughHistoryItemSession = [];
  var iPreviousTime;

  for ( var i = 0, oCurrentVisitItem; oCurrentVisitItem = lChromeVisitItems[i]; i++) {
    if (i === 0) {
      iPreviousTime = oCurrentVisitItem['visitTime'];
    }

    if (Math.abs(oCurrentVisitItem['visitTime'] - iPreviousTime) <= threshold) {
      var iIndex = oCurrentVisitItem['cottonHistoryItemId'];
      if(lNewRoughHistoryItemSession.indexOf(lHistoryItems[iIndex]) === -1){
        lNewRoughHistoryItemSession.push(lHistoryItems[iIndex]);
      }
    } else {
      // Close the session and launch callback, then init a new session.
      mCallBack(lNewRoughHistoryItemSession);
      lNewRoughHistoryItemSession = [];
      lNewRoughHistoryItemSession.push(lHistoryItems[iIndex]);
    }
    iPreviousTime = oCurrentVisitItem['visitTime'];
  }

  mCallBack(lNewRoughHistoryItemSession);
};
