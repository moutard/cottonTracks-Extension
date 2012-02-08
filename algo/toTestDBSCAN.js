'use strict';
//$(function() {
  
  function handleVisitItems(lHistoryItems) {
    // Loop through all the VisitItems and compute their distances to each other.
    // Keys are VisitItem ids.
    // Values are lists of couples with distances including the VisitItem.
    
    initSetOfPoints(lHistoryItems);
    var iNbCluster = DBSCAN(lHistoryItems, 5.0, 5);
    
    console.log(lHistoryItems);

    var lColors = ["#00F", "#0F0", "#F00"];
    var sColorNoise = "#fff";

    for( var iLoop = 0; iLoop < lHistoryItems.length; iLoop++ ){
      var oHistoryItem = lHistoryItems[iLoop];
      var sColor = "#000"

      if( oHistoryItem.clusterId == "NOISE"){
        sColor = sColorNoise; 
      }
      else if( oHistoryItem.clusterId < lColors.length ){
        sColor = lColors[oHistoryItem.clusterId];
      }
      else{
        sColor = "#000";
      }
      var sLine = '<h6 style="color:' + sColor + '">' + oHistoryItem["url"] + '</h6>';
      $("#liste").append(sLine);
    }
  }
  
  //Build the distance matrix for the last XXX visited ages.
  console.log("start");
  
  chrome.history.search({
    'text': '',
    'maxResults': 100,
  }, function(lHistoryItems) {
    console.log(lHistoryItems);
    // Get all the visits for every HistoryItem.
    
    handleVisitItems(lHistoryItems);
  });
  
  
  
//});
