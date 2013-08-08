'use strict';

/**
 * Dispatching Controller
 *
 * Instance host by lightyear.html Listen all the messages send by the UI
 * through the dispatcher and treats them.
 *
 */
Cotton.Controllers.DispatchingController = Class.extend({
  /**
   * {Cotton.Controllers.Lightyear}
   * Main Controller.
   */
  _oLightyearController : null,

  /**
   * @param {Cotton.Controllers.Lightyear} oLightyearController
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oLightyearController, oGlobalDispatcher) {
    this._oLightyearController = oLightyearController;

    oGlobalDispatcher.subscribe('enter_story', this, function(dArguments){
      oLightyearController.openStory(dArguments["story"]);
    });
  }

});
