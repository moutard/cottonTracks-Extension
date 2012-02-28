'use strict';

var Story = function(lHistoryItems) {
  // storyClass

  var lHistoryItems, iStoryLength;

  this.lHistoryItems = lHistoryItems;
  this.iStoryLength = lHistoryItems.length;

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
