'use strict';

UI.StickyBar.HORIZONTAL_SPACING = 250;

// Represents a sticker on the sticky bar.
UI.StickyBar.Sticker = function(oBar, iPosition) {
  var self = this;
  var $sticker = this._$sticker = $('<div class="stickyBar_sticker">');
  this._iPosition = iPosition;
  
  var iFinalPosition = iPosition * UI.StickyBar.HORIZONTAL_SPACING;
  var iDistanceToCenter = $(document).width() / 2 - iFinalPosition;
  var iInitialPosition = iFinalPosition - iDistanceToCenter * 0.2;
  
  $sticker.css({
    left: iInitialPosition
  })
  
  // TODO(fwouts): Use CSS animations.
  $sticker.animate({
    left: iFinalPosition
  }, 'slow', function() {
    self.trigger('ready');
  });
  
  this.on('ready', function() {
    // On complete, draw a line going through this sticker (for testing).
    var oLine = new UI.Path.Line(new UI.Point($sticker.offset().left + $sticker.width() / 2, $sticker.offset().top + $sticker.height() / 2));
    // Make the line appear behind the sticker.
    oLine.$().css('z-index', -1);
  })
};

$.extend(UI.StickyBar.Sticker.prototype, {

  // Returns the jQuery element.
  $: function() {
    return this._$sticker;
  }
  
});

_.extend(UI.StickyBar.Sticker.prototype, Backbone.Events);
