'use strict';

module('Cotton.UI.Stand.Manager.Timestamp', {

});

test('init.', function() {
  var fTomorrow = 0;
  var fTime = 1;
  var isCompleteMonth = 0;
  var oTimestamp = new Cotton.UI.Stand.Manager.TimeStamp(fTomorrow, fTime, isCompleteMonth);
  ok(oTimestamp);
});

test('_computeTitle.', function() {
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

  var lExpectedTitles = ["TODAY", "YESTERDAY", "2 DAYS AGO", "3 DAYS AGO",
    "4 DAYS AGO", "5 DAYS AGO", "6 DAYS AGO", "A WEEK AGO", "2 WEEKS AGO"];

  var isCompleteMonth = false;
  for (var i = 0; i < PERIODS.length - 1; i++) {
    var oTimestamp = new Cotton.UI.Stand.Manager.TimeStamp(fTomorrow,
      fTomorrow - PERIODS[i], isCompleteMonth);
    deepEqual(oTimestamp._computeTitle(fTomorrow, fTomorrow - PERIODS[i] + 1, isCompleteMonth), lExpectedTitles[i]);
  }

  ok(oTimestamp);
});