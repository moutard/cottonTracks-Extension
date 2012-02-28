'use strict';

function Tool(psHostname, pfFrequence){
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
  this.sHostname  = psHostname;
  this.fFrequence = pfFrequence;

}

function sortToolByFrequence(oTool1, oTool2){
  return oTool2.fFrequence - oTool1.fFrequence;
}

function ToolsContainer (){
  // CLASS : ToolsContainer
  // this class provides some methods to class and identify tools

  // Attributes
  var lTools;

   // constructor
  this.lTools = new Array();

}

// PROTOTYPE : ToolsContainer
ToolsContainer.prototype.alreadyExist = function (sHostname){
  // return the index of the tool if it exists
  for(var i = 0; i < this.lTools.length; i++){
    if(this.lTools[i].sHostname === sHostname){
      return i;
    }
  }

  return -1;
}

ToolsContainer.prototype.insertTool = function (psHostname, pfFrequence){
  // insert a new tool in lTools
  // TODO(rmoutard) : sort insertion
  var oTool;

  if(psHostname == undefined){
    console.error("Try to construct a Tool with undefined hostname");
    return false;
  }
  else if(pfFrequence == undefined){
    pfFrequence = 1; // TODO(rmoutard) : change value
  }

  oTool = new Tool(psHostname, pfFrequence);
  // TODO(rmoutard) : sort insertion
  this.lTools.push(oTool);
  return true;
}

ToolsContainer.prototype.increaseFrequence = function (piIndex) {
  if(piIndex < this.lTools.length && piIndex >= 0){
    this.lTools[piIndex].fFrequence += 1;
    return true;
  }
  else{
    console.error("you try to modifiy a index out of bounce");
    return false;
  }
}

ToolsContainer.prototype.insert = function (psHostname) {
  var iIndex = this.alreadyExist(psHostname);

  if( iIndex === -1){
    this.insertTool(psHostname);
  }
  else{
    this.increaseFrequence(iIndex);
  }

}

ToolsContainer.prototype.favoriteTools = function () {
  this.lTools.sort(sortToolByFrequence);
  return this.lTools.slice(0,20);
}

// MAIN :
function detectTools () {
  // detect tools with hight criteria

  // Minimun of use to consider it as a tool
  var iMin = 10;

  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;
  // the best way should be to count use per week.

  // Search by week
  var startTime = 0, endTime = microsecondsPerWeek;
  chrome.history.search({
      'text': '',
      'startTime': startTime,
      'endTime': endTime
    },
    function(lHistoryItems) {

      var lTools = new Array();

      for(var i = 0; i < lHistoryItems.length; i++){
        var oHistoryItems = lHistoryItems[i];

        var sHostname = new parseUrl(oHistoryItems.url).hostname;
        oTools.insert(sHostname);
      }
    }
  );
}

function simpleDetectTools () {
  // detect tools with low criteria

  // criteria :
  // most historyItems with the same hostname
  // do make the difference between favorites, or stream
  var startTime = 0;
  var endTime = 1000*60*60*24*7*4*3;
  chrome.history.search({
      'text': '',
      'maxResults': 10000
    },
    function(lHistoryItems) {

      var oTools = new ToolsContainer();

      for(var i = 0; i < lHistoryItems.length; i++){
        var oHistoryItems = lHistoryItems[i];

        var sHostname = new parseUrl(oHistoryItems.url).hostname;
        oTools.insert(sHostname);
      }

      console.log(oTools.favoriteTools());
    }
  );
}

function generateTools () {

  var lCommonToolsHostname = ['mail.google.com',
                              'continuousintegration.corp.ltutech.com',
                              'docs.google.com',
                              'grooveshark.com',
                              'github.com',
                              'www.facebook.com',
                              'www.deezer.com',
                              'www.wordreference.com'];

  var oToolsContainer = new ToolsContainer();
  for( var i = 0; i < lCommonToolsHostname.length; i++){
    oToolsContainer.insert(lCommonToolsHostname[i]);
  }

  return oToolsContainer;
}
