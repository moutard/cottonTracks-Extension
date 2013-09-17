'use strict';

module('Cotton.UI.Stand.Manager.UIManager', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oManager = new Cotton.UI.Stand.Manager.UIManager([], oDispatcher);
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
  var oManager = new Cotton.UI.Stand.Manager.UIManager(lStories, oDispatcher);
  ok(oManager);
});
