'use strict';

// TODO(fwouts): Cleanup the whole structure of this file.
Cotton.Behavior.Active.ReadingRater = Class.extend({
  
  init: function() {
    var self = this;
    
    // Detect user's activity on the page when they move their cursor.
    // If they don't move it during 10 seconds, we conclude they are inactive.
    this._bDocumentActive = true;
    var oTimeout = null;
    $(document).mousemove(function() {
      self._bDocumentActive = true;

      clearTimeout(oTimeout);
      oTimeout = setTimeout(function() {
        self._bDocumentActive = false;
      }, 10000);
    });
    
    this._bLoggingEnabled = false;
    
    var oParser = this._oParser = new Cotton.Behavior.Passive.Parser();
    
    // Prepare a block to give feedback on the reading percentage.
    var $feedback = $('<div>')
      .css({
        position: 'fixed',
        left: 0,
        bottom: 0,
        border: '3px solid #000',
        background: '#fff',
        fontSize: '2em',
        padding: '0.4em'
      })
      .appendTo('body');

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
      
      if (!self._bDocumentActive) {
        // Do not increase scores if the document is inactive.
        return;
      }
      
      // Compute the visible surface of each block and the total visible surface.
      var lBlockBundles = [];
      var iTotalPageSurface = 0;
      var iTotalVisiblePageSurface = 0;
      
      $('[data-meaningful]').each(function() {
        var $block = $(this);
        var oScore = $block.data('score');
        if (oScore) {
          var iVisibleSurface = oScore.visibleSurface();
          var iTotalSurface = oScore.totalSurface();
          lBlockBundles.push({
            $block: $block,
            iVisibleSurface: iVisibleSurface,
            iTotalSurface: iTotalSurface
          });
          iTotalVisiblePageSurface += iVisibleSurface;
          iTotalPageSurface += iTotalSurface;
        }
        // TODO(fwouts): Check if it is ever possible to not have oScore.
      });
      
      if (iTotalVisiblePageSurface > 0) {
        
        var fPageScore = 0;
        
        $.each(lBlockBundles, function() {
          var fFocusProportion = this.iVisibleSurface / iTotalVisiblePageSurface;
          var oScore = this.$block.data('score');
          // TODO(fwouts): If only 10% of the block is ever visible, the maximum score should be of 10%.
          
          // TODO(fwouts): Use the total quantity of text visible instead of the total visible surface?
          if (this.iTotalSurface > 0) {
            oScore.addScore(fFocusProportion * this.iVisibleSurface / Math.pow(this.iTotalSurface, 2) * 1000 * Cotton.Behavior.Active.ReadingRater.REFRESH_RATE);
            fPageScore += oScore.score() * (this.iTotalSurface / iTotalPageSurface);
          }
          
          var iPercent = Math.round(100 * fPageScore);
          $feedback.text(iPercent + '%');
        });
      }
    }, Cotton.Behavior.Active.ReadingRater.REFRESH_RATE * 100);
  },
  
  log: function(msg) {
    if (this._bLoggingEnabled) {
      console.log(msg);
    }
  }
});

Cotton.Behavior.Active.ReadingRater.REFRESH_RATE = 50;

Cotton.Behavior.Active.ReadingRater.Score = Class.extend({
  
  init: function($block) {
    this._$block = $block;
    this._fScore = 0;
    this._bLoggingEnabled = false;
  },
  
  addScore: function(fAdditionalScore) {
    this._fScore += fAdditionalScore;
    this._fScore = Math.min(1, this._fScore);
    // TODO(fwouts): Use a constant.
    var MIN_COLOR = 128;
    var MAX_COLOR = 255;
    var iColorQuantity = MIN_COLOR + Math.round(this._fScore * (MAX_COLOR - MIN_COLOR));
    this._$block.css('background', 'rgb(' + iColorQuantity + ', ' + iColorQuantity + ', ' + iColorQuantity + ')');
    this._$block.css('color', '#000');
    this.log("Score updated to " + this._fScore);
  },
  
  score: function() {
    return this._fScore;
  },
  
  // TODO(fwouts): Move this method out of there.
  visibleSurface: function() {
    // The score will increase proportionnaly to the visible surface of the block
    // (which depends both on the total surface of the block and the current scroll,
    // which could be hiding part of it).
    var iBlockHeight = this._$block.height();
    var iBlockWidth = this._$block.width();
    
    var iWindowScrollTop = $(window).scrollTop();
    var iWindowVisibleHeight = window.innerHeight;
    var dBlockOffset = this._$block.offset();
    var iBlockOffsetTop = dBlockOffset.top;
    var iBlockOffsetBottom = dBlockOffset.top + iBlockHeight;
    
    var iBlockHiddenTop = (iWindowScrollTop < iBlockOffsetTop) ? 0 : (iWindowScrollTop - iBlockOffsetTop);
    var iBlockHiddenBottom = (iWindowScrollTop + iWindowVisibleHeight > iBlockOffsetBottom) ? 0 : (iBlockOffsetBottom - (iWindowScrollTop + iWindowVisibleHeight));
    
    var iVisibleHeight = Math.max(0, iBlockHeight - iBlockHiddenTop - iBlockHiddenBottom);
    var iVisibleSurface = iVisibleHeight * iBlockWidth;
    
    return iVisibleSurface;
  },
  
  totalSurface: function() {
    var iBlockHeight = this._$block.height();
    var iBlockWidth = this._$block.width();
    return iBlockHeight * iBlockWidth;
  },

  log: function(msg) {
    if (this._bLoggingEnabled) {
      console.log(msg);
    }
  }
});

// For testing.
$(function() {
  new Cotton.Behavior.Active.ReadingRater();
});
