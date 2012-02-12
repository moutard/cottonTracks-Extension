'use strict';
//$(function() {
  
  function handleVisitItems(lHistoryItems) {
    // Loop through all the VisitItems and compute their distances to each other.
    // Keys are VisitItem ids.
    // Values are lists of couples with distances including the VisitItem.
    
    
    var iNbCluster = DBSCAN(lHistoryItems, 50000.0, 5);
    
    var lClusters = Array(iNbCluster);
    
    // COLORS
    var sColorNoise = "#aaa"; // Color Noise
    var sColorUnclassified = "#000"; // Color unclassified
    var lColorsCluster = Array(iNbCluster); // TODO(rmoutard) : make something bijectif
    for (var iColor = 0 ; iColor < lClusters.length; iColor++ ){
      lColorsCluster[iColor] = randomColor();
    }
    
    for( var iLoop = 0; iLoop < lHistoryItems.length; iLoop++ ){
      var oHistoryItem = lHistoryItems[iLoop];
      var sColor;

      if( oHistoryItem.clusterId == "NOISE"){
        sColor = sColorNoise; 
      }
      else if( oHistoryItem.clusterId < lColorsCluster.length ){
        sColor = lColorsCluster[oHistoryItem.clusterId];
      }
      else{
        sColor = sColorUnclassified;
      }
      var sLine = '<p style="color:' + sColor + '">' + oHistoryItem["url"] + '</p>';
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

   // TOOLS
function randomColor(){
  // for more informations : http://paulirish.com/2009/random-hex-color-code-snippets/
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}