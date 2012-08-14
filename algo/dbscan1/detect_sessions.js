'use strict';

/**
 * separate roughly the visit items when the time difference between two
 * consecutive items is more than 5 hours.
 * 
 * @param {Array}
 *          lVisitItems
 */

// TODO(rmoutard) : use an iterator like in underscore.js to make this method
// more generale.
Cotton.Algo.roughlySeparateSession = function(lVisitItems, mCallBack) {
  // 5 hours
  var threshold = 5 * 60 * 60 * 1000;

  var lNewRoughSession = [];
  var iPreviousTime;

  for ( var i = 0, oCurrentVisitItem; oCurrentVisitItem = lVisitItems[i]; i++) {
    if (i === 0) {
      iPreviousTime = oCurrentVisitItem['iVisitTime'];
    }

    if ((oCurrentVisitItem['iVisitTime'] - iPreviousTime) <= threshold) {
      lNewRoughSession.push(oCurrentVisitItem);
    } else {
      mCallBack(lNewRoughSession);
      lNewRoughSession = [];
      lNewRoughSession.push(oCurrentVisitItem);
    }
    iPreviousTime = oCurrentVisitItem['iVisitTime'];

  }

  mCallBack(lNewRoughSession);
};