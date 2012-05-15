'use strict';

// A bubble showing on a line (represents one element of a story).
Cotton.UI.Path.Bubble = function() {
  var self = this;
  
  var $container = this._$container = $('<div class="ct-path_bubble">');
  $container.text('Bubble');
  
  var $handle = this._$handle = $('<div class="ct-path_bubble_handle">');
  $handle.click(function() {
    self.toggle();
  });
  
  this._visible = false;
};

$.extend(Cotton.UI.Path.Bubble.prototype, {
  
  // oBubbleOrigin should be a Cotton.UI.Point instance.
  setOrigin: function(oBubbleOrigin) {
    this._oBubbleOrigin = oBubbleOrigin;
    var $handle = this._$handle;
    $handle.css({
      left: this._oBubbleOrigin.fX,
      top: this._oBubbleOrigin.fY
    });
    $handle.css('opacity', 0);
    $handle.appendTo('body');
    $handle.animate({
      opacity: 1
    }, 'slow');
  },
  
  show: function() {
    this._visible = true;
    this._$container.css({
      display: 'none',
      left: this._oBubbleOrigin.fX,
      top: this._oBubbleOrigin.fY
    }).appendTo('body');
    
    this._$container.show('fast');
  },
  
  hide: function() {
    this._visible = false;
    this._$container.hide('fast');
  },
  
  toggle: function() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  },

  isVisible: function() {
    return this._visible;
  },
  
  remove: function() {
    this._$container.remove();
    this._$handle.remove();
  }
  
});
