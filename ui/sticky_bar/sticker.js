'use strict';

UI.StickyBar.HORIZONTAL_SPACING = 250;

// Represents a sticker on the sticky bar.
UI.StickyBar.Sticker = function(oBar, iPosition) {
  var $sticker = this._$sticker = $('<div class="stickyBar_sticker">');
  this._iPosition = iPosition;
  
  var iFinalPosition = iPosition * UI.StickyBar.HORIZONTAL_SPACING;
  var iDistanceToCenter = $(document).width() / 2 - iFinalPosition;
  var iInitialPosition = iFinalPosition - iDistanceToCenter * 0.2;
  
  $sticker.css({
    left: iInitialPosition
  })
  
  // TODO(fwouts): Attach to a "displayed" event of the bar instead.
  // TODO(fwouts): Use CSS animations.
  setTimeout(function() {
    $sticker.animate({
      left: iFinalPosition
    }, 'slow');
  }, 300);
};

$.extend(UI.StickyBar.Sticker.prototype, {

  // Returns the jQuery element.
  $: function() {
    return this._$sticker;
  }
  
});
