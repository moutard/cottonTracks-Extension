"use strict";

/**
 * Dispatcher that will dispatch every event send by the window DOM element,
 * like resize or ready.
 */
Cotton.Messaging.WindowListener = Class.extend({

  /**
   * Dispatch event to all the UI elements concerned
   */
  _oDispatcher : null,

  init : function(oDispatcher) {
    this._oDispatcher = oDispatcher;

    var $window = $(window);

    $window.scroll(function(){
      oDispatcher.publish('window_scroll', {
        'scroll_top': $window.scrollTop(),
        'height': $window.height()
      });
    });

    var bFirstPopstate = true;
    window.onpopstate = function(){
      oDispatcher.publish('window_popstate', {'first_popstate': bFirstPopstate});
      bFirstPopstate = false;
    };

    this._oDispatcher.subscribe('scrolloffset', this, function() {
      $window.scrollTop(0);
    });

    // Ready.
    $window.ready(function(){
      oDispatcher.publish('window_ready');
    });

    // Resize.
    $window.resize(function(e){
      oDispatcher.publish('window_resize', {
        'width': $(this).width()
      });
    });

    // Key pressed.
    $(window).keydown(function(e){
      switch (e.keyCode) {
      case 27:
        oDispatcher.publish('escape');
        break;
      default:
        break;
      }
    });

  }
});
