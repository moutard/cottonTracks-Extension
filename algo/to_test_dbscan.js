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
      + oHistoryItem["title"] + ' || cluster : ' + oHistoryItem["clusterId"]
      + '</h5>';
  sLine += '<h6 style="font-size:11px; margin:2px">' + oHistoryItem["url"]
      + '</h6>';
  sLine += '</div>';
  $("#liste").append(sLine);
  // console.log(oHistoryItem);
};

function displayStory(oStory) {

  var lHistoryItems = oStory.iter();
  var sColor = randomColor();

  for ( var j = 0; j < lHistoryItems.length; j++) {
    var oHistoryItem = lHistoryItems[j];

    displayHistoryItem(oHistoryItem, sColor);
  }

  $("#liste").append('-------------------------------------------------');

  $('#loader-animation').remove();
};

function displayDBSCANResult(iNbCluster, lHistoryItems) {
  $("#liste div").remove();
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
  // var lDStories = Cotton.Algo.storySELECT(lStories, bUseRelevance);

  $('#loader-animation').remove();
  for ( var i = 0; i < lStories.length; i++) {
    displayStory(lStories[i]);
  }

  openStore(lStories);
}

// MODEL

// clear the dataBase

function storeStories(lStories) {
  // open a Store

  var oStore = new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS
  }, function() {
    console.log("store ready");
    // console.log(this);
    storeData(this, lStories);
  });
}

function storeData(oStore, lStories) {
  // store the most recent in last
  for ( var i = lStories.length - 1, oStory; oStory = lStories[i]; i--) {
    oStore.put('stories', oStory, function() {
      console.log("Story added");
      oStore.list('stories', function(oStory) {
        // console.log(oStory._lHistoryItems);
      });

    });
  }
}

// CONTROLLER
Cotton.DB.ManagementTools.clearDB();
Cotton.DB.ManagementTools.listDB();

// WORKER
var worker = new Worker('algo/worker.js');

worker.addEventListener('message', function(e) {
  console.log('Worker ends: ', e.data.iNbCluster);

  // displayDBSCANResult(e.data.iNbCluster, e.data.lHistoryItems);

  displayStorySELECTResult(e.data.iNbCluster, e.data.lHistoryItems);

}, false);

if (localStorage) {
  // check if broswer support localStorage

  if (localStorage['CottonFirstOpening'] === undefined
      || localStorage['CottonFirstOpening'] === "true") {

    Cotton.DB.ManagementTools.clearDB();
    window.UI.firstVisit();

    chrome.history.search({
      text : '',
      startTime : 0,
      maxResults : Cotton.Config.Parameters.iMaxResult,
    }, function(lHistoryItems) {
      console.log(lHistoryItems);
      // Get all the visits for every HistoryItem.
      worker.postMessage(lHistoryItems);
    });
    localStorage['CottonFirstOpening'] = "false";
  } else {
    // localStorage['CottonFirstOpening'] = true;
    // use stories store in the database
    Cotton.DBSCAN2.startDbscanUser();
    Cotton.DB.ManagementTools.printDB(displayStory);
  }

} else {
  console.log("Browser doesn't support the local storage");
}
