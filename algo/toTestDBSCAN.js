'use strict';
//$(function() {
  
  function handleVisitItems(lVisitItems) {
    // Loop through all the VisitItems and compute their distances to each other.
    // Keys are VisitItem ids.
    // Values are lists of couples with distances including the VisitItem.
    
    initSetOfPoints(lVisitItems);
    var iNbCluster = DBSCAN(lVisitItems, 5.0, 5);
    
    function buildCircle(pVisitItems){
      
      lCircles = new Array(iNbCluster);
      for(var iI=0; iI < iNbCluster; iI++){
        lCircles[iI]= new Array();
      }
      
      for( item in pVisitItems ){
        lCircles[item.clusterId].push(item);
      }
      
      return lCircles;
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
  
  //Build the distance matrix for the last XXX visited ages.
  console.log("start");
  
  chrome.history.search({
    text: '',
    maxResults: 100,
    startTime: 1,
    // Time fixed to avoid having a changing history.
    endTime: 1320400609000
  }, function(lHistoryItems) {
    console.log(lHistoryItems);
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
        lVisitItems = lVisitItems.slice(0, 5);
        lAllVisitItems = lAllVisitItems.concat(lVisitItems);
        iCallbacksLeft--;

        if (iCallbacksLeft == 0) {
          handleVisitItems(lAllVisitItems);
        }
      });
    });
  });
  
  
  
//});
