'use strict';
// $(function() {


// TOOLS
function randomColor() {
  // for more informations :
  // http://paulirish.com/2009/random-hex-color-code-snippets/
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

function displayResult(iNbCluster, lHistoryItems){
  var lClusters = Array(iNbCluster);
  // COLORS
  var sColorNoise = "#fff"; // Color Noise
  var sColorUnclassified = "#000"; // Color unclassified
  var lColorsCluster = Array(iNbCluster); // TODO(rmoutard) : make something
  // bijectif
  for ( var iColor = 0; iColor < lClusters.length; iColor++) {
    lColorsCluster[iColor] = randomColor();
  }

  for ( var iLoop = 0; iLoop < lHistoryItems.length; iLoop++) {
    var oHistoryItem = lHistoryItems[iLoop];
    var sColor;

    if (oHistoryItem.clusterId == "NOISE") {
      sColor = sColorNoise;
    } else if (oHistoryItem.clusterId < lColorsCluster.length) {
      sColor = lColorsCluster[oHistoryItem.clusterId];
    } else {
      sColor = sColorUnclassified;
    }
    var sLine = '<p style="color:' + sColor + '">' + oHistoryItem["title"]
        + '</p>';
    $("#liste").append(sLine);
  }

};

var worker = new Worker('algo/worker.js');

worker.addEventListener('message', function(e) {
  console.log('Worker ends: ', e.data.iNbCluster);

  displayResult(e.data.iNbCluster, e.data.lHistoryItems);
}, false);

// Build the distance matrix for the last XXX visited ages.
//console.log("start");
var single;
chrome.history.search({
  text : '',
  startTime : 0,
  maxResults : 2000,
}, function(lHistoryItems) {
  //console.log(lHistoryItems);
  // Get all the visits for every HistoryItem.
  worker.postMessage(lHistoryItems);
  //handleVisitItems(lHistoryItems);
});

// });


