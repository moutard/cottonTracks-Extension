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
   * {Cotton.Controllers.Mo}
   * Main Controller.
   */
  _oMoController : null,

  /**
   * @param {Cotton.Controllers.Lightyear} oMoController
   * @param {Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(oMoController, oGlobalDispatcher) {
    this._oMoController = oMoController;

    /**
     * Go back to the manager
     */
    oGlobalDispatcher.subscribe('home', this, function(dArguments){
      oMoController._oWorld.openHome(dArguments);
    });

    /**
     * Toggle (open/close) the settings page
     */
    oGlobalDispatcher.subscribe('toggle_settings', this, function(){
      oMoController._oWorld.toggleSettings();
    });

    /**
     * Close for sure the settings page
     */
    oGlobalDispatcher.subscribe('close_settings', this, function(dArguments){
      oMoController._oWorld.closeSettings(dArguments['purge']);
    });

    /**
     * delete a story in db, then ask to delete the corresponding sticker
     **/
    oGlobalDispatcher.subscribe('delete_story', this, function(dArguments){

      var bStoryDeleted = false;
      var bHistoryItemsUnreferenced = false;
      oMoController.database().delete('stories', dArguments['story_id'], function(){
        bStoryDeleted = true;
        // the story is deleted. If items are also unreferenced,
        // tell the UI to remove the sticker
        if (bHistoryItemsUnreferenced) {
          oGlobalDispatcher.publish('remove_cover', {
            'story_id': dArguments['story_id']
          });
        }
      });

      oMoController.database().search('historyItems', 'sStoryId', dArguments['story_id'], function(lHistoryItems){
        // unreference the historyItems, because we use the db as relational
        var iLength = lHistoryItems.length;
        for (var i = 0; i < iLength; i++) {
          lHistoryItems[i].removeStoryId();
        }
        oMoController.database().putList('historyItems', lHistoryItems, function(){
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
     * Update a historyItem in the database
     */
    oGlobalDispatcher.subscribe('update_db_history_item', this, function(dArguments){
      oMoController.database().put('historyItems', dArguments['history_item'], function(){});
    });

    /**
     * bake a cheesecake from a title
     *
     */
    oGlobalDispatcher.subscribe('fetch_recipe', this, function(dArguments){
      oMoController._oBaker.fetch(dArguments['search_words'], function(
        lHistoryItems, lCleanWords){
        var oCheesecake = oMoController._oBaker.bake(lHistoryItems, lCleanWords);
        // send cheesecake to the UI
        oGlobalDispatcher.publish('new_cheesecake', {
          'cheesecake' : oCheesecake
        });
      });
    });

    /**
     * bake a cheesecake from a suggested theme
     */
    oGlobalDispatcher.subscribe('create_suggested_cheesecake', this, function(dArguments){
      var lSearchWords = dArguments['title'].split(/\ |\'|\-/gi);
      oMoController._oBaker.fetch(lSearchWords, function(
        lHistoryItems, lCleanWords){
        var oCheesecake = oMoController._oBaker.bake(lHistoryItems, lCleanWords);
        oCheesecake.setTitle(dArguments['title']);
        // send cheesecake to the UI
        oGlobalDispatcher.publish('open_cheesecake', {
          'cheesecake' : oCheesecake
        });
      });
    });

    /**
     * open or create a cheesecake
     *
     */
    oGlobalDispatcher.subscribe('open_cheesecake', this, function(dArguments){
      oMoController.openCheesecake(dArguments['cheesecake']);
    });

    /**
     * get cheesecakes in db to display them in the library
     * and get recommendations of cheesecakes to create from stories
     *
     */
    oGlobalDispatcher.subscribe('start_homescreen', this, function(){
      var lCheesecakes;
      var lStories;
      var bCheesecakeReady;
      var bStoriesReady;
      // cheesecakes
      oMoController._oDatabase.getList('cheesecakes', function(lDBCheesecakes) {
          lCheesecakes = lDBCheesecakes;
          lCheesecakes.sort(function(a,b){ return b.lastVisitTime() - a.lastVisitTime; });

          oMoController._oDatabase.getList('stories', function(lDBStories) {
            lStories = lDBStories;
             oGlobalDispatcher.publish('fill_homescreen', {
               'cheesecakes': lCheesecakes,
               'stories': lStories,
               'suggestions': []
             });
          });
      });
    });

    // delete a suggestion. We mark a story as banned from suggestions
    oGlobalDispatcher.subscribe('delete_theme_suggestion', this, function(dArguments){
      oMoController.database().find('stories', 'id', dArguments['story_id'], function(oStory){
        oStory.setBannedFromSuggest(1);
        oMoController.database().put('stories', oStory, function(){});
      });
    });

    /**
     * get items from a cheesecake's list of historyItemsId to display in the UICheesecake
     *
     */
    oGlobalDispatcher.subscribe('ask_cheesecake_items', this, function(dArguments){
      oMoController._oDatabase.findGroup('historyItems', 'id', dArguments['history_items_id'], function(lHistoryItems){
        oGlobalDispatcher.publish('give_cheesecake_items', {'history_items' : lHistoryItems});
      });
    });

    /**
     * get items from a cheesecake's list of historyItemsSuggests to display in the CardAdder
     *
     */
    oGlobalDispatcher.subscribe('ask_items_suggestions', this, function(dArguments){
      oMoController._oBaker.fetch(dArguments['title'].split(" "), function(
        lHistoryItems, lCleanWords){
        var oCheesecake = oMoController._oBaker.bake(lHistoryItems, lCleanWords);
        // send suggestions back to the UI
        oGlobalDispatcher.publish('give_items_suggestions', {
          'history_items_suggestions' : oCheesecake.historyItemsSuggest()
        });
      });
    });

    /**
     * get some suggestions based on a user search
     *
     */
    oGlobalDispatcher.subscribe('search_suggestions', this, function(dArguments){
      oMoController._oBaker.fetch(dArguments['search_query'].split(/\ |\+|\'|\-|\./gi), function(
        lHistoryItems, lCleanWords){
        var oCheesecake = oMoController._oBaker.bake(lHistoryItems, lCleanWords);
        // send suggestions back to the UI
        oGlobalDispatcher.publish('refresh_suggestions', {
          'history_items_suggestions' : oCheesecake.historyItemsSuggest()
        });
      });
    });


    /**
     * update a cheesecake in base
     *
     */
    oGlobalDispatcher.subscribe('update_db_cheesecake', this, function(dArguments){
      oMoController._oDatabase.put('cheesecakes', dArguments['cheesecake'], function(iId){
        oGlobalDispatcher.publish('cheesecake_id', {'id': iId});
      });
    });

    /**
     * delete a cheesecake in db, then ask the UI to remove it
     *
     */
    oGlobalDispatcher.subscribe('delete_cheesecake', this, function(dArguments){
      var iId = dArguments['id'];
      oMoController._oDatabase.delete('cheesecakes', iId, function(){
        //FIXME (rkorach) The callback is happening before the cheesecake is deleted in base.
        // Here we do another dumb request because it seems to make sure it's deleted.
        oMoController._oDatabase.search('cheesecakes', 'id', iId, function(o){
          oMoController._oWorld.deleteCheesecake(iId);
        });
      });
    });

    /**
     * get a cheesecake items and return all the images from these items
     *
     */
    oGlobalDispatcher.subscribe('ask_all_cheesecake_images', this, function(dArguments){
      var lHistoryItemsId = dArguments['history_items_id'];
      oMoController._oDatabase.findGroup('historyItems', 'id', lHistoryItemsId, function(lHistoryItems){
        oGlobalDispatcher.publish('give_all_cheesecake_images', {
          'cheesecake_id' : dArguments['cheesecake_id'],
          'history_items' : lHistoryItems
        });
      });
    });
  }

});
