'use strict';

/**
 * Setup all variables once before all the tests. For the moment we don't need
 * to setup before each test.
 */

module(
    "Cotton.Algo.DBSCAN3.detect_sessions",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);

test("roughlySeparateSessionForVisitItems for empty", function() {
  Cotton.Algo.roughlySeparateSessionForVisitItems([],[], function(lSession, iTotalSession) {
    equal(iTotalSession, 1);
    deepEqual(lSession, [])
  });
});

test("roughlySeparateSessionForVisitItems for 1 session non empty", function() {
  var lHistoryItems = [
    {'url': 'a'},
    {'url': 'b'},
    {'url': 'c'}
  ];
  var lVisitItems = [
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
  ];
  Cotton.Algo.roughlySeparateSessionForVisitItems(lHistoryItems, lVisitItems, function(lSession, iTotalSession) {
    equal(iTotalSession, 1);
    equal(lSession.length, 4);
  });
});

test("roughlySeparateSessionForVisitItems for 2 sessions non empty", function() {
  var lHistoryItems = [
    {'url': 'a'},
    {'url': 'b'},
    {'url': 'c'}
  ];
  var lVisitItems = [
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
    { 'visitTime': 10000000, 'cottonHistoryItemId': 2},
    { 'visitTime': 10000001, 'cottonHistoryItemId': 1},
  ];
  Cotton.Algo.roughlySeparateSessionForVisitItems(lHistoryItems, lVisitItems, function(lSession, iTotalSession) {
    if(iTotalSession) {
      equal(iTotalSession, 2);
    }
  });
});
