'use strict';
// TODO(fwouts): Rename dictionaries that have been named with *o instead of *d.
$(function() {

  function handleVisitItems(lVisitItems) {
    // Loop through all the VisitItems and compute their distances to each other.
    var lCouplesWithDistance = [];
    for (var iI = 0, iN = lVisitItems.length; iI < iN; iI++) {
      var oVisitItem1 = lVisitItems[iI];
      // Do not consider couples twice (iJ < iI).
      for (var iJ = 0; iJ < iI; iJ++) {
        var oVisitItem2 = lVisitItems[iJ];
        var oCoupleWithDistance = {
          visitItem1: oVisitItem1,
          visitItem2: oVisitItem2,
          distance: distance(oVisitItem1, oVisitItem2)
        };
        lCouplesWithDistance.push(oCoupleWithDistance);
      }
    }
    // Sort by distance.
    lCouplesWithDistance.sort(function(oA, oB) {
      return oA.distance - oB.distance;
    });
    
    // Print out the first 100 results.
    for (var iI = 0; iI < 100; iI++) {
      var oCoupleWithDistance = lCouplesWithDistance[iI];
      console.log(oCoupleWithDistance.visitItem1.historyItem.url +
                  '\n' +
                  oCoupleWithDistance.visitItem2.historyItem.url +
                  '\nDistance: '
                  + oCoupleWithDistance.distance);
    }
  }

  function distance(oVisitItem1, oVisitItem2) {
    var iUrlAmount = +(oVisitItem1.historyItem.url == oVisitItem2.historyItem.url);
    var iReferringAmount = (oVisitItem1.referringVisitId == oVisitItem2.visitId) + (oVisitItem2.referringVisitId == oVisitItem1.visitId);
    
    var iTitleWordsAmount = 0;
    var lWords1 = extractWords(oVisitItem1.historyItem.title);
    var lWords2 = extractWords(oVisitItem2.historyItem.title);
    // Check how many words they have in common.
    // TODO(fwouts): Write a faster algorithm.
    // TODO(fwouts): Consider using this to check if there are common arts in the URLs.
    var dWords1 = {};
    for (var iI = 0, iN = lWords1.length; iI < iN; iI++) {
      var sWord = lWords1[iI];
      dWords1[sWord] = true;
    }
    for (var iI = 0, iN = lWords2.length; iI < iN; iI++) {
      var sWord = lWords2[iI];
      if (dWords1[sWord]) {
        // The word is resent in both.
        iTitleWordsAmount++;
        // Do not count it twice.
        delete dWords1[sWord];
      }
    }
    
    // The ower the url amount, the closest.
    // The higher the referring amount, the closest.
    // The higher the words amount, the closest.
    return iUrlAmount + 1 / (1 + iReferringAmount) + 1 / (1 + iTitleWordsAmount);
  }
  
  function extractWords(sTitle) {
    // We cannot use the \b boundary symbol in the regex because accented characters would not be considered (not art of \w).
    // Include all normal characters, dash, accented characters.
    // TODO(fwouts): Consider other characters such as digits?
    var oRegexp = /[\w\-\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
    var matches = sTitle.match(oRegexp) || [];
    // TODO(fwouts): Remove useless words such as "-".
    return matches;
  }

  // Build the distance matrix for the ast XXX visited ages.
  chrome.history.search({
    text: '',
    maxResults: 100,
    startTime: 1,
    // Time fixed to avoid having a changing history.
    endTime: 1320400609000
  }, function(lHistoryItems) {
    // Get all the visits for every HistoryItem.
    var lAllVisitItems = [];
    var iN = lHistoryItems.length;
    var iCallbacksLeft = iN;
    $.each(lHistoryItems, function(iI, oHistoryItem) {
      chrome.history.getVisits({
        url: oHistoryItem.url
      }, function(lVisitItems) {
        for (var iI = 0, iN = lVisitItems.length; iI < iN; iI++) {
          lVisitItems[iI].historyItem = oHistoryItem;
        }
        // TODO(fwouts): Consider more visits.
        lVisitItems = lVisitItems.slice(0, 5);
        lAllVisitItems = lAllVisitItems.concat(lVisitItems);
        iCallbacksLeft--;

        if (iCallbacksLeft == 0) {
          handleVisitItems(lAllVisitItems);
        }
      });
    });
  });
  
  // Log a few general statistics.
  chrome.history.search({
    text: '',
    // Maximal integer accepted by the API.
    maxResults: Math.pow(2, 31) - 1,
    startTime: 1
  }, function(lHistoryItems) {
    // Display the total number of unique ages since the beginning of history.
    var iTotalUniquePages = lHistoryItems.length;
    var oSinceDate = (new Date(lHistoryItems[lHistoryItems.length - 1].lastVisitTime)).format();
    console.log(iTotalUniquePages + " unique ages visited since " + oSinceDate);
    
    // Find the number of visits to each subdomain.
    // TODO(fwouts): Since we use visitCount, check if that also counts visits from before startTime.
    // TODO(fwouts): Count domains.
    
    // Dictionary (key = subdomain, value = visit count).
    var dSubDomains = {};
    
    $.each(lHistoryItems, function(iI, oHistoryItem) {
      var sUrl = oHistoryItem.url;
      var sSubDomain = sUrl.split('/')[2];
      if (!dSubDomains[sSubDomain]) {
        dSubDomains[sSubDomain] = 0;
      }
      dSubDomains[sSubDomain] += oHistoryItem.visitCount;
    });
    
    // List to sort by visit count.
    var lSubDomains = [];
    for (var sSubDomain in dSubDomains) {
      lSubDomains.push({
        subDomain: sSubDomain,
        visitCount: dSubDomains[sSubDomain]
      });
    }
    
    lSubDomains.sort(function (dA, dB) {
      return dB.visitCount - dA.visitCount;
    });
    
    console.log("Most visited subdomains:");
    for (var iI = 0; iI < 100; iI++) {
      var dSubDomain = lSubDomains[iI];
      console.log(dSubDomain.subDomain + ': ' + dSubDomain.visitCount + ' visits');
    }
  });
});
