'use strict';
$(function() {

  function handleVisitItems(plVisitItems) {
    // Loop through all the VisitItems and compute their distances to each other.
    var llCouplesWithDistance = [];
    for (var liI = 0, liN = plVisitItems.length; liI < liN; liI++) {
      var loVisitItem1 = plVisitItems[liI];
      // Do not consider couples twice (liJ < liI).
      for (var liJ = 0; liJ < liI; liJ++) {
        var loVisitItem2 = plVisitItems[liJ];
        var loCoupleWithDistance = {
          visitItem1: loVisitItem1,
          visitItem2: loVisitItem2,
          distance: distance(loVisitItem1, loVisitItem2)
        };
        llCouplesWithDistance.push(loCoupleWithDistance);
      }
    }
    // Sort by distance.
    llCouplesWithDistance.sort(function(poA, poB) {
      return poA.distance - poB.distance;
    });
    
    // Print out the first 100 results.
    for (var liI = 0; liI < 100; liI++) {
      console.log(llCouplesWithDistance[liI]);
    }
  }

  function distance(poVisitItem1, poVisitItem2) {
    var liUrlAmount = +(poVisitItem1.url == poVisitItem2.url);
    var liReferringAmount = (poVisitItem1.referringVisitId == poVisitItem2.visitId) + (poVisitItem2.referringVisitId == poVisitItem1.visitId);
    
    // The lower the url factor, the closest.
    // The higher the referring factor, the closest.
    return liUrlAmount + 1 / (1 + liReferringAmount);
  }

  chrome.history.search({
    text: '',
    // Maximal integer accepted by the API.
    //maxResults: Math.pow(2, 31) - 1,
    maxResults: 100,
    startTime: 1,
    endTime: 1320400609000
  }, function(plHistoryItems) {
    // Get all the visits for every HistoryItem.
    var llVisitItems = [];
    var liN = plHistoryItems.length;
    var liCallbacksLeft = liN;
    $.each(plHistoryItems, function(piI, poHistoryItem) {
      chrome.history.getVisits({
        url: poHistoryItem.url
      }, function(plVisitItems) {
        for (var liI = 0, liN = plVisitItems.length; liI < liN; liI++) {
          plVisitItems[liI].url = poHistoryItem.url;
        }
        // TODO(fwouts): Consider more visits.
        plVisitItems = plVisitItems.slice(0, 5);
        llVisitItems = llVisitItems.concat(plVisitItems);
        liCallbacksLeft--;

        if (liCallbacksLeft == 0) {
          handleVisitItems(llVisitItems);
        }
      });
    });
  });
});
