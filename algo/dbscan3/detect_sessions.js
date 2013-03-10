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
      iPreviousTime = oCurrentHistoryItem['iVisitTime'];
    }
    // var a = new Date(iPreviousTime).toLocaleString();
    // var b = new Date(oCurrentHistoryItem['iVisitTime']).toLocaleString();

    if (Math.abs(oCurrentHistoryItem['iVisitTime'] - iPreviousTime) <= threshold) {
      lNewRoughSession.push(oCurrentHistoryItem);
    } else {
      mCallBack(lNewRoughSession);
      lNewRoughSession = [];
      lNewRoughSession.push(oCurrentHistoryItem);
    }
    iPreviousTime = oCurrentHistoryItem['iVisitTime'];

  }

  mCallBack(lNewRoughSession);
};
