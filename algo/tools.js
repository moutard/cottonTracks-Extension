'use strict';

Cotton.Algo.Tool = Class.extend({
  init : function(psHostname, pfFrequence) {
    // CLASS : Tool
    // a Tool is webpage that provides you a service.
    // As mail.google.com, www.youtube.com,
    // they can be identified by their hostname
    // the frequence parameters
    // TODO(rmoutard fwouts): make the difference between
    // favorites and tools

    var sHostname;
    var fFrequence;

    // cosntructor
    this.sHostname = psHostname;
    this.fFrequence = pfFrequence;
  },
});

function sortToolByFrequence(oTool1, oTool2) {
  return oTool2.fFrequence - oTool1.fFrequence;
}

// MAIN :
function detectTools() {
  // detect tools with hight criteria

  // Minimun of use to consider it as a tool
  var iMin = 10;

  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
  // the best way should be to count use per week.

  // Search by week
  var startTime = 0, endTime = microsecondsPerWeek;
  chrome.history.search({
    'text' : '',
    'startTime' : startTime,
    'endTime' : endTime
  }, function(lHistoryItems) {

    var lTools = new Array();

    for ( var i = 0; i < lHistoryItems.length; i++) {
      var oHistoryItems = lHistoryItems[i];

      var sHostname = new parseUrl(oHistoryItems.url).hostname;
      oTools.insert(sHostname);
    }
  });
}

function simpleDetectTools() {
  // detect tools with low criteria

  // criteria :
  // most historyItems with the same hostname
  // do make the difference between favorites, or stream
  var startTime = 0;
  var endTime = 1000 * 60 * 60 * 24 * 7 * 4 * 3;
  chrome.history.search({
    'text' : '',
    'maxResults' : 10000
  }, function(lHistoryItems) {

    var oTools = new ToolsContainer();

    for ( var i = 0; i < lHistoryItems.length; i++) {
      var oHistoryItems = lHistoryItems[i];

      var sHostname = new parseUrl(oHistoryItems.url).hostname;
      oTools.insert(sHostname);
    }

    console.log(oTools.favoriteTools());
  });
}