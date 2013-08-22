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

    /**
     * Enter story
     * - arguments : {Cotton.Model.Story} story
     */
    oGlobalDispatcher.subscribe('enter_story', this, function(dArguments){
      oLightyearController.openStory(dArguments["story"]);
    });

    /**
     * Go back to the manager
     */
    oGlobalDispatcher.subscribe('home', this, function(){
      oLightyearController._oWorld.openManager();
    });

    /**
     * Toggle (open/close) the settings page
     */
    oGlobalDispatcher.subscribe('toggle_settings', this, function(){
      oLightyearController._oWorld.toggleSettings();
    });

    /**
     * Close for sure the settings page
     */
    oGlobalDispatcher.subscribe('close_settings', this, function(dArguments){
      oLightyearController._oWorld.closeSettings(dArguments['purge']);
    });

  }

});
