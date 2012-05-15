'use strict';

// Represents the bar displayed in the middle of the screen, containing stickers for each story.
Cotton.UI.StickyBar.Bar = Class.extend({
  init: function() {
    var self = this;
    this._lStickers = [];
    this._$stickyBar = $('#ct-stickyBar_bar');
    
    this._$stickyBar.animate({
      top: '0px'
    }, 'slow', function() {
      self.trigger('ready');
    });
    
    Cotton.UI.World.COMMUNICATOR.on('story_element', function(oStoryElement) {
      //console.log(oStoryElement.url);
    });
  },
  
  // Returns the jQuery element.
  $: function() {
    return this._$stickyBar;
  },
  
  // Creates a new sticker and adds it to the bar.
  buildSticker: function() {
    // Each sticker will have a different position.
    var iPosition = this._lStickers.length;
    var oSticker = new Cotton.UI.StickyBar.Sticker(this, iPosition);
    this._lStickers.push(oSticker);
    return oSticker;
  },
  
  stickerCount: function() {
    return this._lStickers.length;
  },
  
  // TODO(fwouts): Find a way to avoid having to manipulate DOM elements.
  append: function($sticker) {
    // Note that we append the element to the .container, not directly to the
    // sticky bar.
    this._$stickyBar.find('> .ct-container').append($sticker);
  }
});

_.extend(Cotton.UI.StickyBar.Bar.prototype, Backbone.Events);
