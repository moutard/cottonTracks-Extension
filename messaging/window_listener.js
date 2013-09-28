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

    var bFirstPopstate = true;
    window.onpopstate = function(){
      oDispatcher.publish('window_popstate', {'first_popstate': bFirstPopstate});
      bFirstPopstate = false;
    };

    // Ready.
    $window.ready(function(){
      oDispatcher.publish('window_ready', {
        'height': $window.height(),
        'width': $window.width()
      });
    });

    // Resize.
    $window.resize(function(){
      oDispatcher.publish('window_resize');
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
