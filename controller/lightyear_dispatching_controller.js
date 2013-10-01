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
    oGlobalDispatcher.subscribe('home', this, function(dArguments){
      oLightyearController._oWorld.openManager(dArguments);
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


    /**
     * delete a story in db, then ask to delete the corresponding sticker
     **/
    oGlobalDispatcher.subscribe('delete_story', this, function(dArguments){

      var bStoryDeleted = false;
      var bHistoryItemsUnreferenced = false;
      oLightyearController.database().delete('stories', dArguments['story_id'], function(){
        bStoryDeleted = true;
        // the story is deleted. If items are also unreferenced,
        // tell the UI to remove the sticker
        if (bHistoryItemsUnreferenced) {
          oGlobalDispatcher.publish('remove_cover', {
            'story_id': dArguments['story_id']
          });
        }
      });

      oLightyearController.database().search('historyItems', 'sStoryId', dArguments['story_id'], function(lHistoryItems){
        // unreference the historyItems, because we use the db as relational
        var iLength = lHistoryItems.length;
        for (var i = 0; i < iLength; i++) {
          lHistoryItems[i].removeStoryId();
        }
        oLightyearController.database().putList('historyItems', lHistoryItems, function(){
          bHistoryItemsUnreferenced = true;
          // items are unreferenced. If the story is also deleted,
          // tell the UI to remove the sticker
          if (bStoryDeleted) {
            oGlobalDispatcher.publish('remove_cover', {
              'story_id': dArguments['story_id']
            });
          }
        });
      });
    });
  }

});
