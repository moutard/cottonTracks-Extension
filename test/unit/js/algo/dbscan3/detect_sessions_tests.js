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
    // For the session we need unique historyItems. (as we already compute
    // closest google search page.) The result of session is directly send to
    // the dbscan algorithm that need unique elements.
    equal(lSession.length, 1);
  });
});

test("roughlySeparateSessionForVisitItems for 2 sessions non empty", function() {
  var lHistoryItems = [
    {'url': 'a'},
    {'url': 'b'},
    {'url': 'c'}
  ];
  var iSixHour = 6 * 60 * 60 * 1000;
  var lVisitItems = [
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
    { 'visitTime': 1, 'cottonHistoryItemId': 1},
    { 'visitTime': iSixHour, 'cottonHistoryItemId': 2},
    { 'visitTime': iSixHour + 1, 'cottonHistoryItemId': 1},
  ];
  var iExpectedTotalSession = 2;
  var lExpectedResult = [1, 2];
  var iCount = 0;
  Cotton.Algo.roughlySeparateSessionForVisitItems(lHistoryItems, lVisitItems, function(lSession, iTotalSession) {
    equal(lExpectedResult[iCount], lSession.length);
    iCount+=1;
    if(iTotalSession) {
      equal(iTotalSession, 2);
    }
  });
});
