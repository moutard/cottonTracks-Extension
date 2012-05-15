'use strict';

Cotton.UI.StickyBar.HORIZONTAL_SPACING = 250;

// Represents a sticker on the sticky bar.
Cotton.UI.StickyBar.Sticker = Class.extend({
  
  _oBar: null,
  _iPosition: null,
  _$sticker: null,
  
  init: function(oBar, iPosition) {
    this._oBar = oBar;
    this._iPosition = iPosition;
  },
  
  display: function() {
    var self = this;
    
    var $sticker = this._$sticker = $('<div class="ct-stickyBar_sticker">');
    
    var iStickerCount = this._oBar.stickerCount();
    var iFinalPosition = (this._iPosition - iStickerCount / 2) * Cotton.UI.StickyBar.HORIZONTAL_SPACING + this._oBar.$().width() / 2;
    var iDistanceToCenter = this._oBar.$().width() / 2 - iFinalPosition;
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
      var oLine = new Cotton.UI.Path.Line(new Cotton.UI.Point($sticker.offset().left + $sticker.width() / 2, $sticker.offset().top + $sticker.height() / 2));
      
      $sticker.click(function() {
        oLine.toggle();
        if (oLine.isVisible()) {
          // Make the line appear behind the sticker.
          oLine.$().css('z-index', -1);
        }
      });
    });
    
    this._oBar.append($sticker);
  }
});

_.extend(Cotton.UI.StickyBar.Sticker.prototype, Backbone.Events);
