'use strict';

Cotton.UI.Debug = {};

Cotton.UI.Debug.randomColor = function() {
  // for more informations :
  // http://paulirish.com/2009/random-hex-color-code-snippets/
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

// VIEW
// HISTORY ITEM
Cotton.UI.Debug.displayHistoryItem = function(oHistoryItem, sColor) {

  var sLine = '<div class="url" style="color:' + sColor + '">';
  sLine += '<h5 style="font-size:14px; margin-bottom:0px; margin-top:8px;">'
      + oHistoryItem["title"] + ' || cluster : ' + oHistoryItem["clusterId"]
      + '</h5>';
  sLine += '<h6 style="font-size:11px; margin:2px">' + oHistoryItem["url"]
      + '</h6>';
  sLine += '</div>';
  $("#liste").append(sLine);
};
// VISIT ITEM
Cotton.UI.Debug.displayVisitItem = function(oVisitItem, sColor) {

  var sLine = '<div class="url" style="color:' + sColor + '">';
  sLine += '<h5 style="font-size:14px; margin-bottom:0px; margin-top:8px;">'
      + oVisitItem.title() + ' || cluster : ' + oVisitItem.clusterId
      + '</h5>';
  sLine += '<h6 style="font-size:11px; margin:2px">' + oVisitItem.url()
      + '</h6>';
  sLine += '</div>';
  $("#liste").append(sLine);
};

// STORY
Cotton.UI.Debug.displayStory = function(oStory) {

  var lVisitItemsId = oStory.iter();
  var sColor = Cotton.UI.Debug.randomColor();

     var oStore = new Cotton.DB.Store('ct', {
        'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
      }, function() {
          for ( var j = 0, iVisitItemId; iVisitItemId = lVisitItemsId[j]; j++) {
            oStore.find('visitItems', 'id', iVisitItemId, 
              function(oVisitItem) {
                console.log(oVisitItem);
                Cotton.UI.Debug.displayVisitItem(oVisitItem, sColor);
              });
          }
      });

  $("#liste").append('<h6>-------------------------------------------------</h6>');

  $('#loader-animation').remove();
};

// STORIES
Cotton.UI.Debug.displayStories = function (lStories) {
   for ( var i = 0; i < lStories.length; i++) {
    Cotton.UI.Debug.displayStory(lStories[i]);
  }
};


// OTHER STUFF
// TODO(rmoutard) : seems useless now.
Cotton.UI.Debug.displayDBSCANResult = function(iNbCluster, lHistoryItems) {
  $("#liste div").remove();
  var lClusters = Array(iNbCluster);
  // COLORS
  var sColorNoise = "#fff"; // Color Noise
  var sColorUnclassified = "#000"; // Color unclassified
  var lColorsCluster = Array(iNbCluster); // TODO(rmoutard) : make something
  // bijectif
  for ( var iColor = 0; iColor < lClusters.length; iColor++) {
    lColorsCluster[iColor] = Cotton.UI.Debug.randomColor();
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
    Cotton.UI.Debug.displayHistoryItem(oHistoryItem, sColor);
  }
  $('#loader-animation').remove();
};


Cotton.UI.Debug.displayStorySELECTResult = function(iNbCluster, lHistoryItems) {
  var bUseRelevance = Cotton.Config.Parameters.bUseRelevance;

  var dStories = Cotton.Algo.clusterStory(lHistoryItems, iNbCluster);
  // var lDStories = Cotton.Algo.storySELECT(lStories, bUseRelevance);
  var lStories = dStories.stories;
  $('#loader-animation').remove();

  Cotton.UI.Debug.displayStory(dStories.storyUnderConstruction);
  Cotton.UI.Debug.displayStories(dStories.stories);

  console.log("story under construction :");
  console.log(dStories.storyUnderConstruction);

}

