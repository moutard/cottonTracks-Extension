'use strict';

module('Cotton.UI.Stand.Manager.UIManager', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oManager = new Cotton.UI.Stand.Manager.UIManager(oDispatcher);
  ok(oManager);
});

test('createShelves.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oNow = new Date();
  var oTomorrow = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() + 1,
        0, 0, 0, 0);
  var fTomorrow = oTomorrow.getTime();

  var ONE_DAY = 86400000; // Millisecond in one day.
  var ONE_WEEK = 604800000; // Millisecond in one week.
  var ONE_MONTH = oTomorrow.getTime() - new Date(oNow.getFullYear(),
        oNow.getMonth() - 1, 1, 0, 0, 0, 0).getTime();

  var lStories = [];
  for (var i = 0; i < 10; i++) {
    var oStory = new Cotton.Model.Story();
    oStory.setLastVisitTime(oNow.getTime());
    lStories.push(oStory);
  }
  var oManager = new Cotton.UI.Stand.Manager.UIManager(oDispatcher);
  oManager.createShelves(lStories);
  ok(oManager);
});

test('createShelves one element by shelf.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oNow = new Date();
  var oTomorrow = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() + 1,
        0, 0, 0, 0);
  var fTomorrow = oTomorrow.getTime();

  var ONE_DAY = 86400000; // Millisecond in one day.
  var ONE_WEEK = 604800000; // Millisecond in one week.
  var ONE_MONTH = oTomorrow.getTime() - new Date(oNow.getFullYear(),
      oNow.getMonth() - 1, 1, 0, 0, 0, 0).getTime();
  var PERIODS = [ONE_DAY, 2*ONE_DAY, 3*ONE_DAY, 4*ONE_DAY, 5*ONE_DAY,
      6*ONE_DAY, 7*ONE_DAY, 2*ONE_WEEK, 3*ONE_WEEK, ONE_MONTH];

  var lStories = [];
  for (var i = 0; i < PERIODS.length; i++) {
    var oStory = new Cotton.Model.Story();
    oStory.setLastVisitTime(oNow.getTime() - PERIODS[i]);
    lStories.push(oStory);
  }
  var oManager = new Cotton.UI.Stand.Manager.UIManager(oDispatcher);
  oManager.createShelves(lStories);

  equal(oManager._numberOfStories(), PERIODS.length);
  equal(oManager._lShelves.length,  PERIODS.length);
  for (var j = 0; j < PERIODS.length; j++) {
    equal(oManager._lShelves[j].numberOfStories(), 1);
  }
});

test('createShelves 5 elements by shelf.', function() {
  var KSTORIES = 5;
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oNow = new Date();
  var oTomorrow = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() + 1,
        0, 0, 0, 0);
  var fTomorrow = oTomorrow.getTime();

  var ONE_DAY = 86400000; // Millisecond in one day.
  var ONE_WEEK = 604800000; // Millisecond in one week.
  var ONE_MONTH = oTomorrow.getTime() - new Date(oNow.getFullYear(),
      oNow.getMonth() - 1, 1, 0, 0, 0, 0).getTime();
  var PERIODS = [ONE_DAY, 2*ONE_DAY, 3*ONE_DAY, 4*ONE_DAY, 5*ONE_DAY,
      6*ONE_DAY, 7*ONE_DAY, 2*ONE_WEEK, 3*ONE_WEEK, ONE_MONTH];

  var lStories = [];
  for (var i = 0; i < PERIODS.length; i++) {
    for (var k = 0; k < KSTORIES; k++) {
      // Create 5 stories in the same periods.
      var oStory = new Cotton.Model.Story();
      oStory.setLastVisitTime(oNow.getTime() - PERIODS[i]);
      lStories.push(oStory);
    }
  }
  var oManager = new Cotton.UI.Stand.Manager.UIManager(oDispatcher);
  oManager.createShelves(lStories);

  equal(oManager._numberOfStories(), PERIODS.length*KSTORIES);
  equal(oManager._lShelves.length,  PERIODS.length);
  for (var j = 0; j < PERIODS.length; j++) {
    equal(oManager._lShelves[j].numberOfStories(), KSTORIES);
  }
});

test('createShelves empty shelf (not display).', function() {
  var KSTORIES = 5;
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oNow = new Date();
  var oTomorrow = new Date(oNow.getFullYear(), oNow.getMonth(), oNow.getDate() + 1,
        0, 0, 0, 0);
  var fTomorrow = oTomorrow.getTime();

  var ONE_DAY = 86400000; // Millisecond in one day.
  var ONE_WEEK = 604800000; // Millisecond in one week.
  var ONE_MONTH = oTomorrow.getTime() - new Date(oNow.getFullYear(),
      oNow.getMonth() - 1, 1, 0, 0, 0, 0).getTime();
  var PERIODS = [ONE_DAY, 2*ONE_DAY, 3*ONE_DAY, 4*ONE_DAY, 5*ONE_DAY,
      6*ONE_DAY, 7*ONE_DAY, 2*ONE_WEEK, 3*ONE_WEEK, ONE_MONTH];

  var lStories = [];
  for (var i = 0; i < PERIODS.length; i++) {
    if ((i+1) % 3 === 0) {
      // Create stories only each 3 periods.
      var oStory = new Cotton.Model.Story();
      oStory.setLastVisitTime(oNow.getTime() - PERIODS[i]);
      lStories.push(oStory);
    }
  }
  var oManager = new Cotton.UI.Stand.Manager.UIManager(oDispatcher);
  oManager.createShelves(lStories);

  equal(oManager._numberOfStories(), (PERIODS.length  - 1) / 3);
  equal(oManager._lShelves.length,  (PERIODS.length - 1) / 3);
  for (var j = 0; j < oManager._lShelves.length; j++) {
    if (j % 3) {
      equal(oManager._lShelves[j].numberOfStories(), 1);
    }
  }
});
