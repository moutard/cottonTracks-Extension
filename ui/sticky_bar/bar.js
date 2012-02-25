'use strict';

// Represents the bar displayed in the middle of the screen, containing stickers for each story.
UI.StickyBar.Bar = function() {
  var self = this;
  this._lStickers = [];
  this._$stickyBar = $('#stickyBar_bar');
  
  this._$stickyBar.animate({
    top: '50%'
  }, 'slow', function() {
    self.trigger('ready');
  });
  
  UI.World.COMMUNICATOR.on('story_element', function(oStoryElement) {
    console.log(oStoryElement.url);
  });
};

$.extend(UI.StickyBar.Bar.prototype, {
  
  // Returns the jQuery element.
  $: function() {
    return this._$stickyBar;
  },
  
  // Creates a new sticker and adds it to the bar.
  buildSticker: function() {
    // Each sticker will have a different position.
    var iPosition = this._lStickers.length;
    var oSticker = new UI.StickyBar.Sticker(this, iPosition);
    oSticker.$().appendTo(this._$stickyBar);
    this._lStickers.push(oSticker);
    return oSticker;
  }
  
});

_.extend(UI.StickyBar.Bar.prototype, Backbone.Events);
