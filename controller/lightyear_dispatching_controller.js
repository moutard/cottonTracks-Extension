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


    /**
     * delete a historyItem link to any story in db, then ask to remove the corresponding card
     **/
    oGlobalDispatcher.subscribe('delete_card', this, function(dArguments){

      oLightyearController.database().search('historyItems', 'sStoryId', dArguments['story_id'], function(lHistoryItems){
        var iLength = lHistoryItems.length;
        for (var i = 0; i < iLength; i++) {
          if (lHistoryItems[i].id() === dArguments['history_item_id']) {
            var oDeletedItem = lHistoryItems[i];
            var oUrl = oDeletedItem.oUrl();
            oUrl.fineDecomposition();
            break;
          }
        }
        var reg = new RegExp(".(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$", "g");
        var fileReg = /File\:/ig;
        if (oUrl.searchImage || (reg.exec(oUrl.href) && !oUrl.pathname.match(fileReg))) {
          var sImageUrl = oUrl.searchImage || oUrl.href;
        } else if (oUrl.isGoogleMaps && (oUrl.dHash['!q'] || oUrl.dSearch['q'])) {
          var sMapCode = (oUrl.dHash['!q']) ? oUrl.dHash['!q'].toLowerCase() : oUrl.dSearch['q'].toLowerCase();
        }
        var lHistoryItemsToRemove = [];
        if (sImageUrl) {
          for (var i = 0; i < iLength; i++) {
            var oParsedUrl = lHistoryItems[i].oUrl();
            if (oParsedUrl.href === sImageUrl || oParsedUrl.searchImage === sImageUrl) {
              lHistoryItemsToRemove.push(lHistoryItems[i]);
            }
          }
        } else if (sMapCode) {
          for (var i = 0; i < iLength; i++) {
            var oParsedUrl = lHistoryItems[i].oUrl();
            oParsedUrl.fineDecomposition();
            if (oParsedUrl.isGoogleMaps && (oParsedUrl.dHash['!q'] || oParsedUrl.dSearch['q'])) {
              var sDuplicateMapCode = (oParsedUrl.dHash['!q']) ? oParsedUrl.dHash['!q'].toLowerCase() : oParsedUrl.dSearch['q'].toLowerCase();
              if (sDuplicateMapCode === sMapCode){
                lHistoryItemsToRemove.push(lHistoryItems[i]);
              }
            }
          }
        } else {
          lHistoryItemsToRemove.push(oDeletedItem);
        }
        var iLengthToRemove = lHistoryItemsToRemove.length;
        var iCount = 0;
        for (var i = 0; i < iLengthToRemove; i++) {
          Cotton.DB.Stories.removeHistoryItemInStory(oLightyearController.database(),
          dArguments['story_id'], lHistoryItemsToRemove[i].id(), function(){
            // removeHistoryItemInStory removes the historyItem from the story historyItemsId
            // and set the historyItem storyId back to "UNCLASSIFIED"
            iCount++;
            if (iCount === iLengthToRemove) {
              oGlobalDispatcher.publish('remove_card', {
                'history_item_id': dArguments['history_item_id'],
                'story_id': dArguments['story_id']
              });
            }
          });
        }
      });
    });

  }

});
