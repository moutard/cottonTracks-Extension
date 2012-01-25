'use strict';
// TODO(fwouts): Rename dictionaries that have been named with *o instead of *d.
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
      loCoupleWithDistance = llCouplesWithDistance[liI];
      console.log(loCoupleWithDistance.visitItem1.historyItem.url +
                  '\n' +
                  loCoupleWithDistance.visitItem2.historyItem.url +
                  '\nDistance: '
                  + loCoupleWithDistance.distance);
    }
  }

  function distance(poVisitItem1, poVisitItem2) {
    var liUrlAmount = +(poVisitItem1.historyItem.url == poVisitItem2.historyItem.url);
    var liReferringAmount = (poVisitItem1.referringVisitId == poVisitItem2.visitId) + (poVisitItem2.referringVisitId == poVisitItem1.visitId);
    
    var liTitleWordsAmount = 0;
    var llWords1 = extractWords(poVisitItem1.historyItem.title);
    var llWords2 = extractWords(poVisitItem2.historyItem.title);
    // Check how many words they have in common.
    // TODO(fwouts): Write a faster algorithm.
    // TODO(fwouts): Consider using this to check if there are common parts in the URLs.
    var ldWords1 = {};
    for (var liI = 0, liN = llWords1.length; liI < liN; liI++) {
      var lsWord = llWords1[liI];
      ldWords1[lsWord] = true;
    }
    for (var liI = 0, liN = llWords2.length; liI < liN; liI++) {
      var lsWord = llWords2[liI];
      if (ldWords1[lsWord]) {
        // The word is present in both.
        liTitleWordsAmount++;
        // Do not count it twice.
        delete ldWords1[lsWord];
      }
    }
    
    // The lower the url amount, the closest.
    // The higher the referring amount, the closest.
    // The higher the words amount, the closest.
    return liUrlAmount + 1 / (1 + liReferringAmount) + 1 / (1 + liTitleWordsAmount);
  }
  
  function extractWords(psTitle) {
    // We cannot use the \b boundary symbol in the regex because accented characters would not be considered (not part of \w).
    // Include all normal characters, dash, accented characters.
    // TODO(fwouts): Consider other characters such as digits?
    var loRegexp = /[\w\-\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
    var matches = psTitle.match(loRegexp) || [];
    // TODO(fwouts): Remove useless words such as "-".
    return matches;
  }

  // Build the distance matrix for the last XXX visited pages.
  chrome.history.search({
    text: '',
    maxResults: 100,
    startTime: 1,
    // Time fixed to avoid having a changing history.
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
          plVisitItems[liI].historyItem = poHistoryItem;
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
  
  // Log a few general statistics.
  chrome.history.search({
    text: '',
    // Maximal integer accepted by the API.
    maxResults: Math.pow(2, 31) - 1,
    startTime: 1
  }, function(plHistoryItems) {
    // Display the total number of unique pages since the beginning of history.
    var liTotalUniquePages = plHistoryItems.length;
    var loSinceDate = (new Date(plHistoryItems[plHistoryItems.length - 1].lastVisitTime)).format();
    console.log(liTotalUniquePages + " unique pages visited since " + loSinceDate);
    
    // Find the number of visits to each subdomain.
    // TODO(fwouts): Since we use visitCount, check if that also counts visits from before startTime.
    // TODO(fwouts): Count domains.
    
    // Dictionary (key = subdomain, value = visit count).
    var ldSubDomains = {};
    
    $.each(plHistoryItems, function(piI, poHistoryItem) {
      var lsUrl = poHistoryItem.url;
      var lsSubDomain = lsUrl.split('/')[2];
      if (!ldSubDomains[lsSubDomain]) {
        ldSubDomains[lsSubDomain] = 0;
      }
      ldSubDomains[lsSubDomain] += poHistoryItem.visitCount;
    });
    
    // List to sort by visit count.
    var llSubDomains = [];
    for (var lsSubDomain in ldSubDomains) {
      llSubDomains.push({
        subDomain: lsSubDomain,
        visitCount: ldSubDomains[lsSubDomain]
      });
    }
    
    llSubDomains.sort(function (pdA, pdB) {
      return pdB.visitCount - pdA.visitCount;
    });
    
    console.log("Most visited subdomains:");
    for (var liI = 0; liI < 100; liI++) {
      var ldSubDomain = llSubDomains[liI];
      console.log(ldSubDomain.subDomain + ': ' + ldSubDomain.visitCount + ' visits');
    }
  });
});
