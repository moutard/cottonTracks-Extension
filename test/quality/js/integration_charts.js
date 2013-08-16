'use strict';
google.load('visualization', '1', {packages:['table', 'corechart']});
google.setOnLoadCallback(launchTests);

var colors = ['#62FF70', '#0579FF', '#E8409F', '#FF4234', '#FF8F0D'];

function drawChromeRepartitionChart(iHistoryItem, iAfterPreremoveTools, iVisitItems) {
  var data = google.visualization.arrayToDataTable([
    ['State',                  'You'],
    ['HistoryItem',            iHistoryItem],
    ['After preremovetools',   iAfterPreremoveTools],
    ['VisitItem',              iVisitItems],
  ]);

  var options = {
    'title': 'Chrome history repartition',
    'colors': colors
  };

  var chart = new google.visualization.LineChart(document.getElementById('chrome_visit_chart'));
  chart.draw(data, options);
};

function drawSessionsRepartitionChart(lCottonHistoryItems, lChromeVisitItems) {
  var llData = [
  ['Session Size', 'You'],
  ['0-5',             0],
  ['5-10',            0],
  ['10-50',           0],
  ['50-100',          0],
  ['100-300',         0],
  ['>300',            0]
  ];

  var $small_sessions = $('#small_sessions');
  Cotton.Algo.roughlySeparateSessionForVisitItems(
      lCottonHistoryItems,
      lChromeVisitItems,
      function(lSession){
    if(lSession.length <= 5) {
      llData[1][1] +=1;
      $small_sessions.append(sessionToDOM(lSession, 0))
    } else if(lSession.length <= 10) {
      llData[2][1] +=1;
    } else if(lSession.length <= 50) {
      llData[3][1] +=1;
    } else if(lSession.length <= 100) {
      llData[4][1] +=1;
    } else if(lSession.length <= 300){
      llData[5][1] +=1;
    } else {
      llData[6][1] +=1;
    }

  });

  var data = google.visualization.arrayToDataTable(llData);

  var options = {
    title: 'Rough session size',
    hAxis: {title: 'Size of sessions', titleTextStyle: {color: 'red'}},
    'colors': colors
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('roughly_sessions_chart'));
  chart.draw(data, options);
};

function drawStoriesRepartition(iStories){
  $('#stories_repartition_chart').text(iStories);
};

var MockDatabase = Class.extend({
  init: function() {},
  putList : function(sStoreName, lListOfObjects, mCallback) {
    mCallback(lListOfObjects);
  },
});

function launchTests() {
  var oMockDatabase = new MockDatabase();
  var oChromeHistoryClient = new Cotton.Core.History.Client();
  var oTempDatabase = new Cotton.Core.TempDatabase(oMockDatabase);
  oTempDatabase.populate(function(lCottonHistoryItems, lChromeVisitItems,
      iHistoryItem) {
    drawChromeRepartitionChart(iHistoryItem, lCottonHistoryItems.length, lChromeVisitItems.length)
    var start = new Date().getTime();
    var stop = (new Date().getTime() - start)/1000;
    DEBUG && console.debug('Suite elapsed time:' + stop + 'seconds');

    drawSessionsRepartitionChart(lCottonHistoryItems, lChromeVisitItems);

    var iStories = 0;
    var fEps = Cotton.Config.Parameters.dbscan3.fEps;
    var iMinPts = Cotton.Config.Parameters.dbscan3.iMinPts;
    var lStories = [];

    Cotton.Algo.roughlySeparateSessionForVisitItems(lCottonHistoryItems, lChromeVisitItems,
      function(lSession){
        var oTranslator = Cotton.Translators.HISTORY_ITEM_TRANSLATORS[0];
        var ldSession = [];
        for(var i = 0; i < lSession.length; i++){
          ldSession.push(oTranslator.objectToDbRecord(lSession[i]));
        }
        var iNbSubCluster = Cotton.Algo.DBSCAN(ldSession, fEps, iMinPts,
          Cotton.Algo.Score.DBRecord.HistoryItem);
        iStories += iNbSubCluster;
        var lNewStories = Cotton.Algo.clusterStory(ldSession, iNbSubCluster);
        _.each(lStories, function(oStory){
          if(oStory.historyItemsId().length < Cotton.Config.Parameters.dbscan3.iMinPts){
            DEBUG && console.debug('session');
            DEBUG && console.debug(JSON.stringify(lSession));
            DEBUG && console.debug('dsession');
            DEBUG && console.debug(JSON.stringify(ldSession));
          }
        });

        // For all the new stories
        var iLength = lNewStories.length;
        for (var i = 0; i < iLength; i++) {
          var oNewStory = lNewStories[i];
          // Find among all the stories we already have one that could be merged with.
          var lMergedStories = [];
          var jLength = lStories.length;
          for (var j = 0; j < jLength; j++) {
            var oStoredStory = lStories[j];
            // TODO(rkorach) : do not use _.intersection
            if (_.intersection(oNewStory.historyItemsId(), oStoredStory.historyItemsId()).length > 0 ||
              (oNewStory.tags().length > 0
              && oNewStory.tags().length === oStoredStory.tags().length
              && oNewStory.tags().join().length === oStoredStory.tags().join().length
              && oNewStory.tags().sort().join() === oStoredStory.tags().sort().join())) {
                // there is an item in two different stories or they have the same words
                // in the title
                oNewStory.setHistoryItemsId(
                  _.union(oNewStory.historyItemsId(),oStoredStory.historyItemsId()));
                oNewStory.setLastVisitTime(Math.max(
                  oNewStory.lastVisitTime(),oStoredStory.lastVisitTime()));
                if (!oNewStory.featuredImage() || oNewStory.featuredImage() === "") {
                  oNewStory.setFeaturedImage(oStoredStory.featuredImage());
                }
            } else {
              lMergedStories.push(oStoredStory);
            }
          }
          lMergedStories.push(oNewStory);
          lStories = lMergedStories;
        }
    });
    drawStories(lStories);
    drawStoriesRepartition(iStories);
  });
};


function sessionToDOM(lSession, owner){
  var $small_session = $('<div class="small_session color' +owner+'"></div>');
  for(var i=0; i < lSession.length; i++){
   $small_session.append(historyItemToDOM(lSession[i]));
  }
  return $small_session;
};
function historyItemToDOM(oHistoryItem) {
  var $history_item = $('<div class="history_item"></div>');
  $history_item.text(JSON.stringify([oHistoryItem.title(), oHistoryItem.url()]));
  return  $history_item;
};
function historyItemRecordToDOM(dHistoryItem) {
  var $history_item = $('<div class="history_item"></div>');
  $history_item.text(JSON.stringify(dHistoryItem['sTitle']) + " :::: "
  + JSON.stringify(dHistoryItem['oExtractedDNA']['dBagOfWords'])
  + '<br>' + dHistoryItem['sUrl']);
  return  $history_item;
};

function storyToDOM(oStory){
  var $story = $('<div class="story"></div>');
  var $title = $('<div class="title"></div>').text(oStory.title());
  var $historyItemsId = $('<div class="historyItemsId"></div>');
  var $historyItems = $('<div class="historyItems"></div>');
  for(var i = 0; i < oStory.historyItemsId().length; i++){
    $historyItemsId.append($('<span>'+oStory.historyItemsId()[i]+'</span>'));
    $historyItems.append(historyItemRecordToDOM(oStory._lHistoryItemsRecord[i]));
  }
  $story.append($title, $historyItemsId, $historyItems);
  return $story;
};
function drawStories(lStories){
  var $stories = $('#stories');
  _.each(lStories, function(oStory){
    $stories.append(storyToDOM(oStory));
  });
};
