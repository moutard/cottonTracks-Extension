'use strict';

/**
 * Separate roughly the visitItems when the time difference between two
 * consecutive items is more than 5 hours.
 * And copy the corresponding historyItems so the algo can work.
 *
 * Even if there is no session return an empty session.
 * @param {Array}
 *          lHistoryItems
 */
Cotton.Algo.roughlySeparateSessionForVisitItems = function(lHistoryItems, lChromeVisitItems,
    mCallBack) {
  // 5 hours
  var threshold = 5 * 60 * 60 * 1000;

  var lNewRoughHistoryItemSession = [];
  var iPreviousTime;
  var iTotalSessions = 0;

  for ( var i = 0, oCurrentVisitItem; oCurrentVisitItem = lChromeVisitItems[i]; i++) {
    if (i === 0) {
      iPreviousTime = oCurrentVisitItem['visitTime'];
    }

    if (Math.abs(oCurrentVisitItem['visitTime'] - iPreviousTime) <= threshold) {
      var iIndex = oCurrentVisitItem['cottonHistoryItemId'];
      // WHY ?
      if(lNewRoughHistoryItemSession.indexOf(lHistoryItems[iIndex]) === -1) {
        lNewRoughHistoryItemSession.push(lHistoryItems[iIndex]);
      }
    } else {
      iTotalSessions++;
      // Close the Session and launch callback on it, then init a new session
      mCallBack(lNewRoughHistoryItemSession);
      lNewRoughHistoryItemSession = [];
      lNewRoughHistoryItemSession.push(lHistoryItems[iIndex]);
    }
    iPreviousTime = oCurrentVisitItem['visitTime'];
  }
  iTotalSessions++;
  mCallBack(lNewRoughHistoryItemSession, iTotalSessions);
};
