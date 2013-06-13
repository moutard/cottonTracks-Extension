'use strict';
var lHistoryItems = [
  {
    'id':1,
    'iStoryId' : -1,
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362754370120.657

  },
  {
    'id':2,
    'iStoryId' : -1,
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362740369641.147

  },
  {
    'id':3,
    'iStoryId' : -1,
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362739338323.528

  },
  {
    'id':4,
    'iStoryId' : -1,
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362739338323.528

  },
  {
    'id':4,
    'iStoryId' : -1,
    'sUrl': "http://cottontracks.com",
    'sTitle': "cottonTracks - the application.",
    'iLastVisitTime': 1362657401358.013

  }
];


module("Cotton.Model.Story",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oStory = new Cotton.Model.Story({});
  ok(oStory)
});

test("addDbRecordHistoryItem.", function() {
  var oStory = new Cotton.Model.Story({});
  for(var i = 0, iLength = lHistoryItems.length; i < iLength; i++){
    oStory.addDbRecordHistoryItem(lHistoryItems[i]);
  }
  equal(oStory.lastVisitTime(), 1362754370120.657);
  deepEqual(oStory.historyItemsId(), [1,2,3,4]);
});

test("addHistoryItemId.", function() {
  var oStory = new Cotton.Model.Story({});
  for(var i = 0, iLength = lHistoryItems.length; i < iLength; i++){
    oStory.addHistoryItemId(lHistoryItems[i]['id']);
  }
  deepEqual(oStory.historyItemsId(), [1,2,3,4]);
});

test("historyItems is reset.", function() {
  var oStory = new Cotton.Model.Story({});
  deepEqual(oStory.historyItemsId(), []);
});

test("removeHistoryItem for an empty.", function() {
  var oStory = new Cotton.Model.Story({});
  deepEqual(oStory.historyItemsId(), []);
  oStory.removeHistoryItem(1);
  deepEqual(oStory.historyItemsId(), []);
});

test("removeHistoryItem for an empty1.", function() {
  var oStory = new Cotton.Model.Story({});
  oStory.removeHistoryItem(1);
  deepEqual(oStory._lHistoryItems, []);
});

test("removeHistoryItem.", function() {
  var oStory = new Cotton.Model.Story({});
  for(var i = 0, iLength = lHistoryItems.length; i < iLength; i++){
    oStory.addHistoryItemId(lHistoryItems[i]['id']);
  }
  oStory.removeHistoryItem(1);
  deepEqual(oStory.historyItemsId(), [2,3,4]);

});

test("removeHistoryItem2.", function() {
  var oStory = new Cotton.Model.Story({});
  for(var i = 0, iLength = lHistoryItems.length; i < iLength; i++){
    oStory.addHistoryItemId(lHistoryItems[i]['id']);
  }
  oStory.removeHistoryItem(1);
  deepEqual(oStory._lHistoryItemsId, [2,3,4]);

});
