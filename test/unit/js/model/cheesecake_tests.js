'use strict';
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
    'sUrl': "http://cottontracks.com/faq.html",
    'sTitle': "cottonTracks - the faq.",
    'iLastVisitTime': 1362740369641.147
  },
  {
    'id':3,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com/about.html",
    'sTitle': "cottonTracks - the founders.",
    'iLastVisitTime': 1362739338323.528
  },
  {
    'id':4,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com/tos.html",
    'sTitle': "cottonTracks - the terms of services.",
    'iLastVisitTime': 1362739135580.423
  },
  {
    'id':4,
    'sStoryId' : "UNCLASSIFIED",
    'sUrl': "http://cottontracks.com/blog.html",
    'sTitle': "cottonTracks - the blog.",
    'iLastVisitTime': 1362657401358.013
  }
];


module("Cotton.Model.Cheesecake",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  ok(oCheesecake)
});

// historyItems
test("addHistoryItemId.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  var iLength = lHistoryItems.length;
  for(var i = 0; i < iLength; i++){
    oCheesecake.addHistoryItemId(lHistoryItems[i]['id']);
  }
  deepEqual(oCheesecake.historyItemsId(), [1,2,3,4]);
});

test("historyItems is reset.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  deepEqual(oCheesecake.historyItemsId(), []);
});

test("removeHistoryItem for an empty.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  deepEqual(oCheesecake.historyItemsId(), []);
  oCheesecake.removeHistoryItem(1);
  deepEqual(oCheesecake.historyItemsId(), []);
});

test("removeHistoryItem for an empty1.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  oCheesecake.removeHistoryItem(1);
  deepEqual(oCheesecake._lHistoryItems, []);
});

test("removeHistoryItem.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  var iLength = lHistoryItems.length;
  for(var i = 0; i < iLength; i++){
    oCheesecake.addHistoryItemId(lHistoryItems[i]['id']);
  }
  oCheesecake.removeHistoryItem(1);
  deepEqual(oCheesecake.historyItemsId(), [2,3,4]);
});

test("removeHistoryItem2.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  var iLength = lHistoryItems.length;
  for(var i = 0; i < iLength; i++){
    oCheesecake.addHistoryItemId(lHistoryItems[i]['id']);
  }
  oCheesecake.removeHistoryItem(1);
  deepEqual(oCheesecake._lHistoryItemsId, [2,3,4]);
});

// HistoryItemsSuggest
test("historyItemsSuggest is reset.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  deepEqual(oCheesecake.historyItemsSuggestId(), []);
});

test("removeHistoryItemSuggest for an empty.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  deepEqual(oCheesecake.historyItemsSuggestId(), []);
  oCheesecake.removeHistoryItemSuggest(1);
  deepEqual(oCheesecake.historyItemsSuggestId(), []);
});

test("removeHistoryItemSuggest for an empty1.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  oCheesecake.removeHistoryItemSuggest(1);
  deepEqual(oCheesecake._lHistoryItemsSuggest, []);
});

test("removeHistoryItemSuggest.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  var iLength = lHistoryItems.length;
  for(var i = 0; i < iLength; i++){
    oCheesecake.addHistoryItemSuggestId(lHistoryItems[i]['id']);
  }
  oCheesecake.removeHistoryItemSuggest(1);
  deepEqual(oCheesecake.historyItemsSuggestId(), [2,3,4]);
});

test("removeHistoryItemSuggest2.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  var iLength = lHistoryItems.length;
  for(var i = 0; i < iLength; i++){
    oCheesecake.addHistoryItemSuggestId(lHistoryItems[i]['id']);
  }
  oCheesecake.removeHistoryItemSuggest(1);
  deepEqual(oCheesecake._lHistoryItemsSuggestId, [2,3,4]);
});

// HistoryItemsExclude
test("historyItemsExclude is reset.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  deepEqual(oCheesecake.historyItemsExcludeId(), []);
});

test("removeHistoryItemExclude for an empty.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  deepEqual(oCheesecake.historyItemsExcludeId(), []);
  oCheesecake.removeHistoryItemExclude(1);
  deepEqual(oCheesecake.historyItemsExcludeId(), []);
});

test("removeHistoryItemExclude for an empty1.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  oCheesecake.removeHistoryItemExclude(1);
  deepEqual(oCheesecake._lHistoryItemsExclude, []);
});

test("removeHistoryItemExclude.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  var iLength = lHistoryItems.length;
  for(var i = 0; i < iLength; i++){
    oCheesecake.addHistoryItemExcludeId(lHistoryItems[i]['id']);
  }
  oCheesecake.removeHistoryItemExclude(1);
  deepEqual(oCheesecake.historyItemsExcludeId(), [2,3,4]);
});

test("removeHistoryItemExclude2.", function() {
  var oCheesecake = new Cotton.Model.Cheesecake();
  var iLength = lHistoryItems.length;
  for(var i = 0; i < iLength; i++){
    oCheesecake.addHistoryItemExcludeId(lHistoryItems[i]['id']);
  }
  oCheesecake.removeHistoryItemExclude(1);
  deepEqual(oCheesecake._lHistoryItemsExcludeId, [2,3,4]);
});
