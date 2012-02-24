'use strict';
//$(function() {

  function handleVisitItems(lHistoryItems) {
    // Loop through all the VisitItems and compute their distances to each other.
    // Keys are VisitItem ids.
    // Values are lists of couples with distances including the VisitItem.

    // PARAMETERS
    // Max Distance between neighborhood
    var fEps = 50000.0;
    // Min Points in a cluster
    var iMinPts = 5;

    lHistoryItems = removeTools(lHistoryItems);
    var iNbCluster = DBSCAN(lHistoryItems, fEps, iMinPts);

    var lClusters = Array(iNbCluster);

    // COLORS
    var sColorNoise = "#fff"; // Color Noise
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
    text: '',
    startTime:0,
    maxResults: 2000,
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
