'use strict';

Cotton.Model.Story = function(lHistoryItems) {
  // storyClass

  var lHistoryItems, iStoryLength, fLastVisit;

  if (lHistoryItems === undefined) {
    this.lHistoryItems = new Array();
  } else {
    this.lHistoryItems = lHistoryItems;
  }
  this.fLastVisitTime = 0;
};

// TODO(rmoutard): Use the $.extend syntax?

// PROTOTYPE
// GETTER
Cotton.Model.Story.prototype.length = function() {
  return this.lHistoryItems.length;
}
// SETTER
Cotton.Model.Story.prototype.addHistoryItem = function(oHistoryItems) {
  this.lHistoryItems.push(oHistoryItems);
  if (oHistoryItems.lastVisitTime > this.fLastVisit) {
    this.fLastVisit = oHistoryItems.lastVisitTime;
  }
};

Cotton.Model.Story.prototype.getStartPoint = function() {

  return this.lHistoryItems[0];
};

Cotton.Model.Story.prototype.getEndPoint = function() {

  return this.lHistoryItems[lHistoryItems.length - 1];
};

Cotton.Model.Story.prototype.getMainPoint = function() {

};

Cotton.Model.Story.prototype.storySCAN = function() {

};
