'use strict';
window.UI = window.UI || {};

// Represents the bar displayed in the middle of the screen, containing stickers for each story.
UI.StickyBar = function() {
  this._$stickyBar = $('#stickyBar');
  
  this._$stickyBar.animate({
    top: '50%'
  }, 'slow');
};

$.extend(UI.StickyBar, {
  
});
