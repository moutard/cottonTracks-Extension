'use strict';

Cotton.UI.Story.Storyline = Class.extend({
  
  _$storyLine: null,
  
  /**
   * A jQuery DOM object representing the vertical line joining all items.
   */
  init: function() {
    
    if (Cotton.UI.Story.Storyline._oCurrentlyOpenStoryline) {
      Cotton.UI.Story.Storyline._oCurrentlyOpenStoryline.remove();
    }
    
    this._$storyLine = $('<div class="ct-storyLine"></div>');
    $('body').append(this._$storyLine);
    
    // TODO(fwouts): Improve/cleanup.
    this._$storyLine.css({
      height: window.innerHeight
    });
    
    Cotton.UI.Story.Storyline._oCurrentlyOpenStoryline = this;
  },
  
  buildStory: function(oVisitItem) {
    var oItem = new Cotton.UI.Story.Item(oVisitItem);
    oItem.appendTo(this);
    return oItem;
  },
  
  remove: function() {
    this._$storyLine.remove();
    this._$storyLine = null;
    Cotton.UI.Story.Storyline._oCurrentlyOpenStoryline = null;
  },
  
  $: function() {
    return this._$storyLine;
  }
});

/**
 * We keep the currently open storyline in order to close it if we try to
 * open a new one later.
 */
Cotton.UI.Story.Storyline._oCurrentlyOpenStoryline = null;
