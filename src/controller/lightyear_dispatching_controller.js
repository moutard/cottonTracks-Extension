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
      oLightyearController._oWorld.clear();
      var oStory = dArguments["story"];
      oLightyearController.getRelatedStoriesId(oStory, function(lRelatedStoriesId){
        var lExclusiveRelatedStoriesId = [];
        var iLength = lRelatedStoriesId.length;
        for (var i = 0; i < iLength; i++) {
          if (lRelatedStoriesId[i] !== dArguments["story"].id()) {
            lExclusiveRelatedStoriesId.push(lRelatedStoriesId[i]);
          }
        }
        oLightyearController.getStories(lExclusiveRelatedStoriesId, function(lRelatedStories){
          oLightyearController.storyHandler().fillAndFilterStories(lRelatedStories, function(lStoriesFiltered){
            oLightyearController.openStory(oStory, lStoriesFiltered);
          });
        });
      });
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
     * Toggle (open/close) the settings page
     */
    oGlobalDispatcher.subscribe('toggle_ratings', this, function(){
      oLightyearController._oWorld.toggleRatings();
    });

    /**
     * Close for sure the settings page
     */
    oGlobalDispatcher.subscribe('close_settings', this, function(){
      oLightyearController._oWorld.closeSettings(false);
    });

    /**
     * Close for sure the settings page
     */
    oGlobalDispatcher.subscribe('close_ratings', this, function(){
      oLightyearController._oWorld.closeRatings(false);
    });

    /**
     * Delete a story in db, then ask to delete the corresponding sticker.
     */
    oGlobalDispatcher.subscribe('delete_story', this, function(dArguments){

      var bStoryDeleted = false;
      var bHistoryItemsUnreferenced = false;
      oLightyearController.database().delete('stories', dArguments['story_id'], function(){
        bStoryDeleted = true;
        // The story is deleted. If items are also unreferenced,
        // tell the UI to remove the sticker.
        if (bHistoryItemsUnreferenced) {
          oGlobalDispatcher.publish('remove_cover', {
            'story_id': dArguments['story_id']
          });
        }
      });

      oLightyearController.database().search('historyItems', 'sStoryId', dArguments['story_id'], function(lHistoryItems){
        // Unreference the historyItems, because we use the db as relational.
        var iLength = lHistoryItems.length;
        for (var i = 0; i < iLength; i++) {
          lHistoryItems[i].removeStoryId();
        }
        oLightyearController.database().putList('historyItems', lHistoryItems, function(){
          bHistoryItemsUnreferenced = true;
          // Items are unreferenced. If the story is also deleted,
          // tell the UI to remove the sticker.
          if (bStoryDeleted) {
            oGlobalDispatcher.publish('remove_cover', {
              'story_id': dArguments['story_id']
            });
          }
        });
      });
    });


    /**
     * Delete a historyItem link to any story in db, then ask to remove the corresponding card.
     */
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
        var reg = new RegExp("\.(jpg|jpeg|png|gif)$", "gi");
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


    /**
     * Expand the 'add card' tool.
     */
    oGlobalDispatcher.subscribe('expand_card_adder', this, function(dArguments){
      // The "Add Card" button has been clicked, we fetch the elements of the pool
      // to propose them.
      var oPool = oLightyearController.getPool();
      oLightyearController.getPoolItems(oPool, function(lPoolItems){
        // Filter the items, in order not to propose search.
        var lFilteredPoolItems = oLightyearController.storyHandler()._filterHistoryItems(lPoolItems);
        oGlobalDispatcher.publish('pool_items', {
          'items': lFilteredPoolItems
        });
      });
    });

    /**
     * Add an item from the pool in a story
     */
    oGlobalDispatcher.subscribe('add_item_to_story', this, function(dArguments){
      // An item from the pool has been selected to be added to the story.
      var oHistoryItem = dArguments['history_item'];
      var oNow = new Date();
      // Change the time to now so that the item gets at the top of the story.
      oHistoryItem.setLastVisitTime(oNow.getTime());
      oLightyearController._oDatabase.putUnique('historyItems', oHistoryItem, function(oHistoryItemId){
        oLightyearController._oDatabase.find('stories', 'id', dArguments['story_id'], function(oStory){
          // merge bag of words of the historyItem to the story
          oStory.dna().bagOfWords().mergeBag(oHistoryItem.extractedDNA().bagOfWords().get());
          // add the item featured image to the story if necessary
          if ((!oStory.featuredImage() || oStory.featuredImage() === "")
            && oHistoryItem.extractedDNA().imageUrl() !== ""){
              oStory.setFeaturedImage(oHistoryItem.extractedDNA().imageUrl());
          }
          // add the historyitem id to the story
          oStory.addHistoryItemId(oHistoryItem.id());
          // this sets the updated story in the database with the new historyItem id,
          // plus the corresponding historyItem with the storyId, plus the searchKeywords
          Cotton.DB.Stories.addStories(oLightyearController._oDatabase, [oStory], function(){
            // take the item out of the pool
            oLightyearController.getPool().delete(oHistoryItem.id());

            oGlobalDispatcher.publish('append_new_card', {
              'story_id': dArguments['story_id'],
              'history_item': oHistoryItem
            });
          });
        });
      });
    });

    /**
     * Search story
     *
     * Search stories are display in a partial view.
     */
    oGlobalDispatcher.subscribe('search_stories', this, function(dArguments){
      oLightyearController._oFinder.search(dArguments['search_words'], function(lStories, sSearchPattern){
        var sSearchTitle = "search results for " + sSearchPattern.toUpperCase();
        oLightyearController.openPartial(lStories, sSearchTitle, "No Result");
      });
    });

    /**
     * Favorite a story
     */
    oGlobalDispatcher.subscribe('favorite_story', this, function(dArguments){
      oLightyearController._oDatabase.find('stories', 'id', dArguments['story_id'], function(oStory){
        oStory.setFavorite(1);
        oLightyearController._oDatabase.putUnique('stories', oStory, function(){});
      });
    });

    /**
     * Unfavorite a story
     */
    oGlobalDispatcher.subscribe('unfavorite_story', this, function(dArguments){
      oLightyearController._oDatabase.find('stories', 'id', dArguments['story_id'], function(oStory){
        oStory.setFavorite(0);
        oLightyearController._oDatabase.putUnique('stories', oStory, function(){});
      });
    });

    /**
     * Show favorite stories
     */
    oGlobalDispatcher.subscribe('favorites', this, function(dArguments){
      oLightyearController._oWorld.clear();
      oLightyearController.getFavoriteStories(function(lStories){
        Cotton.ANALYTICS.navigate('favorites', lStories.length);
        oLightyearController.openPartial(lStories, "Favorite Stories", "No Favorite Stories");
      });
    });

    /**
     * Change story title
     */
    oGlobalDispatcher.subscribe('change_title', this, function(dArguments){
      oLightyearController.database().find('stories', 'id', dArguments['story_id'], function(oStory){
        oStory.setTitle(dArguments['title']);
        // add new title words in bag of words of the story
        var lTitle = dArguments['title'].split(' ');
        var lStrongWords = Cotton.Algo.Tools.TightFilter(lTitle);
        oStory.dna().addListWords(lStrongWords, oStory.dna().bagOfWords().maxWeight());
        oLightyearController.database().put('stories', oStory, function(){});
      });
    });

    /**
     * autocomplete when search story
     *
     * Ask the possible keywords that match the given prefix, for autocomplete.
     */
    oGlobalDispatcher.subscribe('autocomplete_ask', this, function(dArguments){
      oLightyearController._oFinder.autocomplete(dArguments['prefix'],
        function(lPossibleKeywords) {
          oGlobalDispatcher.publish('autocomplete_answer', {
            'possible_keywords': lPossibleKeywords
          });
        });
    });

    // SWITCH TO PROTOTYPE
    oGlobalDispatcher.subscribe('switch_to_proto', this, function(){
      localStorage.setItem('proto_test', true);
      localStorage.setItem('favorite_to_cheesecakes', true);
      oLightyearController._oCoreMessenger.sendMessage({
        'action' : 'switch_to_proto',
      }, function(response) {
        window.close();
      });
    });
  }

});
