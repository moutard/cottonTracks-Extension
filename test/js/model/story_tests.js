var lHistoryItems = [
  {
    'id':1,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362754370120.657

  },
  {
    'id':2,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362740369641.147

  },
  {
    'id':3,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362739338323.528

  },
  {
    'id':4,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362739338323.528

  },
  {
    'id':4,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362657401358.013

  }
];
module(
    "Cotton.Algo.Common.ClusterStory",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


module("Cotton.Model.Story",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oStory = new Cotton.Model.Story();
  ok(oStory)
});

test("addDbRecordHistoryItem.", function() {
  var oStory = new Cotton.Model.Story();
  for(var i = 0; i < lHistoryItems.length; i++){
    oStory.addDbRecordHistoryItem(lHistoryItems[i]);
  }
  equal(oStory.lastVisitTime(), 1362754370120.657);
  deepEqual(oStory.historyItemsId(), [1,2,3,4]);
});

test("addHistoryItemId.", function() {
  var oStory = new Cotton.Model.Story();
  for(var i = 0; i < lHistoryItems.length; i++){
    oStory.addHistoryItemId(lHistoryItems[i]['id']);
  }
  deepEqual(oStory.historyItemsId(), [1,2,3,4]);
});

