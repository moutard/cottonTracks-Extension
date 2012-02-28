'use strict';

var Story = function(lHistoryItems) {
  // storyClass

  var lHistoryItems, iStoryLength, fLastVisit;

  if (lHistoryItems === undefined) {
    this.lHistoryItems = new Array();
  } else {
    this.lHistoryItems = lHistoryItems;
  }
  this.fLastVisitTime = 0;
};

// PROTOTYPE
// GETTER
Story.prototype.length = function() {
  return this.lHistoryItems.length;
}
// SETTER
Story.prototype.addHistoryItem = function(oHistoryItems) {
  this.lHistoryItems.push(oHistoryItems);
  if (oHistoryItems.lastVisitTime > this.fLastVisit) {
    this.fLastVisit = oHistoryItems.lastVisitTime;
  }
};

Story.prototype.getStartPoint = function() {

  return this.lHistoryItems[0];
};

Story.prototype.getEndPoint = function() {

  return this.lHistoryItems[lHistoryItems.length - 1];
};

Story.prototype.getMainPoint = function() {

};

Story.prototype.storySCAN = function() {

};
