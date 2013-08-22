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
