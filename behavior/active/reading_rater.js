'use strict';

Cotton.Behavior.Active.ReadingRater = Class.extend({
  
  init: function() {
    var oParser = this._oParser = new Cotton.Behavior.Passive.Parser();

    // Refresh every 5 seconds.
    setInterval(function() {
      oParser.parse();
    }, 5000);
    // Launch almost immediately (but try to avoid freezing the page).
    setTimeout(function() {
      oParser.parse();
    }, 0);
    
    $('[data-meaningful]').livequery(function() {
      var $block = $(this);
      var oScore = $block.data('score');
      if (!oScore) {
        oScore = new Cotton.Behavior.Active.ReadingRater.Score($block);
        $block.data('score', oScore);
      }
    });
    
    setInterval(function() {
      
      // Compute the visible surface of each block and the total visible surface.
      var lBlockBundles = [];
      var iTotalVisibleSurface = 0;
      
      $('[data-meaningful]').each(function() {
        var $block = $(this);
        var oScore = $block.data('score');
        if (oScore) {
          var iVisibleSurface = oScore.visibleSurface();
          lBlockBundles.push({
            $block: $block,
            iVisibleSurface: iVisibleSurface
          });
          iTotalVisibleSurface += iVisibleSurface;
        }
        // TODO(fwouts): Check if it is ever possible to not have oScore.
      });
      
      $.each(lBlockBundles, function() {
        var fFocusProportion = this.iVisibleSurface / iTotalVisibleSurface;
        var oScore = this.$block.data('score');
        oScore.addScore(fFocusProportion);
      });
    }, 100);
  }
});

Cotton.Behavior.Active.ReadingRater.Score = Class.extend({
  
  init: function($block) {
    this._$block = $block;
    this._fScore = 0;
  },
  
  addScore: function(fAdditionalScore) {
    this._fScore += fAdditionalScore;
    var iColorQuantity = Math.round(this._fScore * 50);
    this._$block.css('background', 'rgb(' + iColorQuantity + ', ' + iColorQuantity + ', ' + iColorQuantity + ')');
    console.log("Score updated to " + this._fScore);
  },
  
  // TODO(fwouts): Move this method out of there.
  visibleSurface: function() {
    // The score will increase proportionnaly to the visible surface of the block
    // (which depends both on the total surface of the block and the current scroll,
    // which could be hiding part of it).
    var iBlockHeight = this._$block.height();
    var iBlockWidth = this._$block.width();
    
    var iWindowScrollTop = $(window).scrollTop();
    var iWindowVisibleHeight = $(window).height();
    var dBlockOffset = this._$block.offset();
    var iBlockOffsetTop = dBlockOffset.top;
    var iBlockOffsetBottom = dBlockOffset.top;
    
    var iBlockHiddenTop = (iWindowScrollTop < iBlockOffsetTop) ? 0 : (iWindowScrollTop - iBlockOffsetTop);
    var iBlockHiddenBottom = (iWindowScrollTop + iWindowVisibleHeight > iBlockOffsetBottom) ? 0 : (iBlockOffsetBottom - (iWindowScrollTop + iWindowVisibleHeight));
    
    var iVisibleHeight = Math.max(0, iBlockHeight - iBlockHiddenTop - iBlockHiddenBottom);
    var iVisibleSurface = iVisibleHeight * iBlockWidth;
    return iVisibleSurface;
  }
});

// For testing.
$(function() {
  new Cotton.Behavior.Active.ReadingRater();
});
