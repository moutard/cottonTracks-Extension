'use strict';
// Disclaimer : this file is just a draft to visualize easily result from the
// algo

// TOOLS
function randomColor() {
  // for more informations :
  // http://paulirish.com/2009/random-hex-color-code-snippets/
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

// VIEW
function displayHistoryItem(oHistoryItem, sColor) {

  var sLine = '<div class="url" style="color:' + sColor + '">';
  sLine += '<h5 style="font-size:14px; margin-bottom:0px; margin-top:8px;">'
      + oHistoryItem["title"] + '</h5>';
  sLine += '<h6 style="font-size:11px; margin:2px">' + oHistoryItem["url"]
      + '</h6>';
  sLine += '</div>';
  $("#liste").append(sLine);
};

function displayStory(oStory) {
  var a = oStory.iter();

  oStory.removeHistoryItem(a[a.length - 1].id);
  oStory.moveHistoryItem(a[a.length - 2].id);

  var lHistoryItems = oStory.iter();
  var sColor = randomColor();

  for ( var j = 0; j < lHistoryItems.length; j++) {
    var oHistoryItem = lHistoryItems[j];

    displayHistoryItem(oHistoryItem, sColor);
  }

  $("#liste").append('-------------------------------------------------');
};

function displayDBSCANResult(iNbCluster, lHistoryItems) {
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
    displayHistoryItem(oHistoryItem, sColor);
  }
  $('#loader-animation').remove();
};

function displayStorySELECTResult(iNbCluster, lHistoryItems) {
  var bUseRelevance = Cotton.Config.Parameters.bUseRelevance;

  var lStories = Cotton.Algo.clusterStory(lHistoryItems, iNbCluster);
  var lDStories = Cotton.Algo.storySELECT(lStories, bUseRelevance);

  $('#loader-animation').remove();
  for ( var i = 1; i < lDStories.length; i++) {
    displayStory(lDStories[i]);
  }

}

var worker = new Worker('algo/worker.js');

worker.addEventListener('message', function(e) {
  console.log('Worker ends: ', e.data.iNbCluster);
  // displayDBSCANResult(e.data.iNbCluster, e.data.lHistoryItems);
  displayStorySELECTResult(e.data.iNbCluster, e.data.lHistoryItems);

}, false);

// Build the distance matrix for the last XXX visited ages.
// console.log("start");
var single;
chrome.history.search({
  text : '',
  startTime : 0,
  maxResults : Cotton.Config.Parameters.iMaxResult,
}, function(lHistoryItems) {
  // console.log(lHistoryItems);
  // Get all the visits for every HistoryItem.
  worker.postMessage(lHistoryItems);
  // handleVisitItems(lHistoryItems);
});
