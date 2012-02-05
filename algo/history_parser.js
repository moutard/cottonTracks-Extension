'use strict';
// TODO(fwouts): Rename dictionaries that have been named with *o instead of *d.
$(function() {

  function handleVisitItems(lVisitItems) {
    // Loop through all the VisitItems and compute their distances to each other.
    // Keys are VisitItem ids.
    // Values are lists of couples with distances including the VisitItem.
    var dCouplesWithDistance = {};
    for (var iI = 0, iN = lVisitItems.length; iI < iN; iI++) {
      var oVisitItem1 = lVisitItems[iI];
      var lCouplesWithDistanceForVisitItem1 = [];
      // We consider couples twice intentionally (to fill both keys in dCouplesWithDistance).
      for (var iJ = 0; iJ < iN; iJ++) {
        var oVisitItem2 = lVisitItems[iJ];
        var dCoupleWithDistance = {
          visitItem1: oVisitItem1,
          visitItem2: oVisitItem2,
          distance: distance(oVisitItem1, oVisitItem2)
        };
        lCouplesWithDistanceForVisitItem1.push(dCoupleWithDistance);
      }
      // Sort by distance.
      lCouplesWithDistanceForVisitItem1.sort(function(oA, oB) {
        return oA.distance - oB.distance;
      });
      dCouplesWithDistance[oVisitItem1.id] = lCouplesWithDistanceForVisitItem1;
    }
    
    var dCircledVisitItemIds = {};
    $.each(dCouplesWithDistance, function(iVisitItem1Id, lCouplesWithDistanceForVisitItem1) {
      // If a circle has already been made containing this VisitItem, skip it.
      if (dCircledVisitItemIds[iVisitItem1Id]) {
        return true;
      }
      // Make a circle out of the closest VisitItems.
      var lCircle = buildCircle(iVisitItem1Id);
      if(lCircle.length > 1) {
        $.each(lCircle, function(iI, iVisitItemId) {
          dCircledVisitItemIds[iVisitItemId] = true;
        });
        displayCircle(lCircle);
      }
    });
    
    // Builds a circle recursively by exploring all links as long as the distance between links remains under
    // a certain threshold.
    // iCurrentVisitItemId: The id of the VisitItem we are currently exploring from.
    // dAddedVisitItemIds: A dictionary where keys are all VisitItems' ids that have been or will be explored.
    function buildCircle(iCurrentVisitItemId, dAddedVisitItemIds) {
      dAddedVisitItemIds = dAddedVisitItemIds || {};
      dAddedVisitItemIds[iCurrentVisitItemId] = true;
      var lCouplesWithDistanceForCurrentVisitItem = dCouplesWithDistance[iCurrentVisitItemId];
      var lNewVisitItemIds = [iCurrentVisitItemId];
      $.each(lCouplesWithDistanceForCurrentVisitItem, function(iI, dCoupleWithDistance) {
        if (dCoupleWithDistance.distance >= 0) {
          // Break out of the loop.
          return false;
        }
        // Only add the VisitItem to the list if it wasn't already there.
        if (!dAddedVisitItemIds[dCoupleWithDistance.visitItem2.id]) {
          lNewVisitItemIds = $.merge(lNewVisitItemIds, buildCircle(dCoupleWithDistance.visitItem2.id, dAddedVisitItemIds));
        }
      });
      return lNewVisitItemIds;
    }
    
    function displayCircle(lCircle) {
      // TODO(fwouts): Move the UI stuff out of this file.
      var $sticker = $('<div class="sticker">').appendTo('#stickyBar');
      var $ul = $('<ul>').appendTo($sticker);
      console.log("\n\n\n\n\nA circle:\n")
      $.each(lCircle, function(iI, iVisitItemId) {
        var oHistoryItem = dCouplesWithDistance[iVisitItemId][0].visitItem1.historyItem;
        var sUrl = oHistoryItem.url;
        var sTitle = oHistoryItem.title || sUrl;
        var $li = $('<li>').appendTo($ul);
        var $a = $('<a>').attr('href', sUrl).text(sTitle);
        $a.appendTo($li);
        console.log(sUrl);
      });
      
    }
  }

  function distance(oVisitItem1, oVisitItem2) {
    
    var iUrlAmount = +(oVisitItem1.historyItem.url == oVisitItem2.historyItem.url);
    
    var iSubDomainAmount = +(extractSubDomain(oVisitItem1.historyItem) == extractSubDomain(oVisitItem2.historyItem));
    
    var iReferringAmount = (oVisitItem1.referringVisitId == oVisitItem2.visitId) + (oVisitItem2.referringVisitId == oVisitItem1.visitId);
    
    var iTitleWordsAmount = 0;
    var lWords1 = extractWords(oVisitItem1.historyItem.title);
    var lWords2 = extractWords(oVisitItem2.historyItem.title);
    // Check how many words they have in common.
    // TODO(fwouts): Write a faster algorithm.
    // TODO(fwouts): Consider using this to check if there are common parts in the URLs.
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
    // We say that there has to be a minimum of 2 common words.
    iTitleWordsAmount -= 1;
    
    // The higher the url amount, the closest.
    // The higher the subdomain amount, the closest.
    // The higher the referring amount, the closest.
    // The higher the words amount, the closest.
    // TODO(fwouts): Consider the time difference between the opening time of tabs (multiply it by other factors?).
    return -5. * iUrlAmount + 1. * iSubDomainAmount - 1. * iReferringAmount - 1. * iTitleWordsAmount;
    
    // TODO: Exclude from stories "too frequent centers" like www.google.com -> better splitting between stories.
    // Idea: Exclude points so that the story would be splitted in at least three stories.
  }
  
  function extractSubDomain(oHistoryItem) {
    var sUrl = oHistoryItem.url;
    var sSubDomain = sUrl.split('/')[2];
    return sSubDomain;
  }
  
  function extractWords(sTitle) {
    // We cannot use the \b boundary symbol in the regex because accented characters would not be considered (not art of \w).
    // Include all normal characters, dash, accented characters.
    // TODO(fwouts): Consider other characters such as digits?
    var oRegexp = /[\w\-\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
    var lMatches = sTitle.match(oRegexp) || [];
    // Split CamelCase words for better results.
    lMatches = $.map(lMatches, function(sWord) {
      var oCamelRegexp = /[a-zA-Z][a-z]+/g;
      var lCamelMatches = [];
      var lCamelMatch;
      while (lCamelMatch = oCamelRegexp.exec(sWord)) {
        lCamelMatches.push(lCamelMatch[0]);
      }
      return lCamelMatches || sWord;
    });
    // Make all words lower case (after splitting CamelCase!).
    lMatches = $.map(lMatches, function(sWord) {
      return sWord.toLowerCase();
    });
    // TODO(fwouts): Be nicer on the words we keep, but still reject useless words such as "-".
    lMatches = $.grep(lMatches, function(sWord) {
      return sWord.length > 2;
    });
    return lMatches;
  }

  // Build the distance matrix for the last XXX visited ages.
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
      var sSubDomain = extractSubDomain(oHistoryItem);
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
