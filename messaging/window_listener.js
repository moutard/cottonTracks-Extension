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
  }

})
