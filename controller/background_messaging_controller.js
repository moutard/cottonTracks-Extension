'use strict';

Cotton.Controllers.Messaging = Class.extend({
  /**
   * Main Controller.
   */
  _oMainController : null,

  init : function(oMainController) {
    this._oMainController = oMainController;
  },

  /**
   * Call the method that correponds to the action message.
   * TODO(rmoutard) : make a error handler in case the function does not exist.
   */
  doAction : function(sAction, lArguments){
    this[sAction].apply(this, lArguments);
  },

  addSearchKeywordsToDb : function(oHistoryItem, iHistoryItemId){
    var self = this;
    for (var i = 0, lKeywords = _.keys(oHistoryItem.extractedDNA().bagOfWords().get()), iLength = lKeywords.length;
      i < iLength; i++){
        var sKeyword = lKeywords[i];
        var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
        oSearchKeyword.addReferringHistoryItemId(iHistoryItemId);
        self._oMainController._oDatabase.putUniqueKeyword('searchKeywords',
          oSearchKeyword, function(iHistoryItemId){
            // Return nothing to let the connection be cleaned up.
        });
    }
  },

  /**
   * Send by a content_script, each time a new tab is open or
   * parser has updated informations.
   *
   * Available params :
   * request['params']['historyItem']
   */
  'create_history_item' : function(sendResponse, dHistoryItem, sender){
      var self = this;
      Cotton.ANALYTICS.visitHistoryItem();
      /**
       * Because Model are compiled in two different way by google closure
       * compiler we need a common structure to communicate throught messaging.
       * We use dbRecord, and translators give us a simple serialisation process.
       */
      //FIXME(rmoutard): use TranslatorCollection.
      var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
      var oTranslator = lTranslators[lTranslators.length - 1];
      var oHistoryItem = oTranslator.dbRecordToObject(dHistoryItem);
      DEBUG && console.debug("Messaging - create_history_item");
      DEBUG && console.debug(oHistoryItem.url());
      if (self._oMainController._dGetContentTabId[sender.tab.id]){
        // this is a get content, do not update the date
        oHistoryItem.setLastVisitTime(0);
      }
      oHistoryItem = Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(oHistoryItem);
      //compute closest searchpage with searchcache
      oHistoryItem = Cotton.Algo.findClosestSearchPage(
          oHistoryItem, self._oMainController._oSearchCache);
      oHistoryItem.extractedDNA().setMinWeightForWord();
      dHistoryItem = oTranslator.objectToDbRecord(oHistoryItem);

      if (oHistoryItem.oUrl().keywords){
        self._oMainController._oSearchCache.putUnique(dHistoryItem);
      }

      var sPutId = ""; // put return the auto-incremented id in the database.

      self._oMainController._oDatabase.find('historyItems',
        'sUrl', oHistoryItem.url(), function(_oHistoryItem){
          if (_oHistoryItem){
            oHistoryItem.incrementVisitCount(_oHistoryItem.visitCount());
            dHistoryItem['iVisitCount'] += _oHistoryItem.visitCount();
          }
          if(_oHistoryItem && _oHistoryItem.storyId() !== "UNCLASSIFIED" ){
            // update the item
            self._oMainController._oDatabase.putUniqueHistoryItem('historyItems',
              oHistoryItem, function(iHistoryItemId){});
            // There is a story for this item, so enable the browserAction
            // and attach a storyId to the tab
            Cotton.ANALYTICS.storyAvailable('already in story');
            sPutId = _oHistoryItem.id();
            sendResponse({
              'received' : "true",
              'id' : sPutId,
              'storyId' : _oHistoryItem.storyId(),
              'visitCount' : oHistoryItem.visitCount(),
              'bagOfWords' : oHistoryItem.extractedDNA().bagOfWords().get()
            });
          } else {
            // See if the history items can fit in a story.
            // take keywords in bag of words with the highest score
            var lPreponderantKeywords = oHistoryItem.extractedDNA().bagOfWords().preponderant(
              Cotton.Config.Parameters.iNumberOfPreponderantKeywords);
            self._oMainController._oDatabase.findGroup('searchKeywords',
              'sKeyword', lPreponderantKeywords, function(lSearchKeywords){
                var lStoriesId = [];
                for (var i = 0, iLength = lSearchKeywords.length; i < iLength; i++){
                  var oSearchKeyword = lSearchKeywords[i];
                  lStoriesId = _.union(lStoriesId, oSearchKeyword.referringStoriesId());
                }

                // Find the story that is the closest to the historyItem.
                self._oMainController._oDatabase.findGroup('stories', 'id',
                  lStoriesId, function(lStories){
                    // Cosine is a distance -> cosine smaller -> story closer.
                    // FIXME(rmoutard) : find a real value for this !
                    var iMaxScore = Cotton.Config.Parameters.dbscan2.iMaxScore;
                    var oMinStory = undefined;
                    for (var i = 0, iLength = lStories.length; i < iLength; i++) {
                      var oStory = lStories[i];
                      var iCurrentScore = Cotton.Algo.Score.Object.historyItemToStory(
                        oHistoryItem, oStory);
                      if(iCurrentScore > iMaxScore){
                        oMinStory = oStory;
                        iMaxScore = iCurrentScore;
                      }
                    }

                    // If we find a min story put the historyItem in it.
                    if(oMinStory){
                      oHistoryItem.setStoryId(oMinStory.id());
                      self._oMainController._oDatabase.putUniqueHistoryItem('historyItems',
                        oHistoryItem, function(iHistoryItemId){
                          DEBUG && console.debug("historyItem added" + iHistoryItemId);
                          sPutId = iHistoryItemId;
                          self.addSearchKeywordsToDb(oHistoryItem, iHistoryItemId);
                          oMinStory.addHistoryItemId(iHistoryItemId);
                          self._oMainController._oDatabase.put('stories', oMinStory,
                            function(){});
                          sendResponse({
                            'received' : "true",
                            'id' : sPutId,
                            'storyId' : oHistoryItem.storyId(),
                            'visitCount' : oHistoryItem.visitCount(),
                            'bagOfWords' : oHistoryItem.extractedDNA().bagOfWords().get()
                          });
                      });
                      oMinStory.dna().bagOfWords().mergeBag(
                        oHistoryItem.extractedDNA().bagOfWords().get());
                      self._oMainController._oDatabase.put(
                        'stories', oMinStory, function(iStoryId){});
                      // There is a story for this item, so enable the browserAction
                      // and attach a storyId to the tab
                      Cotton.ANALYTICS.storyAvailable('join existing story');

                    } else {
                      self._oMainController._oDatabase.putUniqueHistoryItem('historyItems',
                        oHistoryItem, function(iHistoryItemId){
                          DEBUG && console.debug("historyItem added" + iHistoryItemId);
                          sPutId = iHistoryItemId;
                          dHistoryItem['id'] = sPutId;
                          self.addSearchKeywordsToDb(oHistoryItem, iHistoryItemId);
                          // Put the history item in the pool.
                          self._oMainController._oPool.putUnique(dHistoryItem);
                          // Lauch dbscan2 on the pool.
                          var wDBSCAN2 = self._oMainController.initWorkerDBSCAN2();
                          wDBSCAN2.postMessage({
                            'pool': self._oMainController._oPool.get(),
                            'sender': sender.tab.id
                          });
                          sendResponse({
                            'received' : "true",
                            'id' : sPutId,
                            'storyId' : oHistoryItem.storyId(),
                            'visitCount' : oHistoryItem.visitCount(),
                            'bagOfWords' : oHistoryItem.extractedDNA().bagOfWords().get()
                          });
                      });
                    }
                });
            });
          }
      });
  },

  /**
   * When the reading rater has modified the dna.
   */
  'update_history_item' : function(sendResponse, dHistoryItem, bContentSet, sender){
      var self = this;
      /**
       * Because Model are compiled in two different way by google closure
       * compiler we need a common structure to communicate throught messaging.
       * We use dbRecord, and translators give us a simple serialisation process.
       */
      var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
      var oTranslator = lTranslators[lTranslators.length - 1];
      var oHistoryItem = oTranslator.dbRecordToObject(dHistoryItem);
      DEBUG && console.debug("Messaging - update_history_item");
      DEBUG && console.debug(oHistoryItem.url());
      // TODO(rmoutard) : use DB system, or a singleton.
      var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

      var sPutId = ""; // put return the auto-incremented id in the database.

      if (self._oMainController._dGetContentTabId[sender.tab.id]){
        // this is a get content, do not update the date
        oHistoryItem.setLastVisitTime(0);
      }

      // The history item already exists, just update it.
      self._oMainController._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId) {
        DEBUG && console.debug("Messaging - historyItem updated" + iId);
        if (bContentSet){
          if (oHistoryItem.storyId() !== "UNCLASSIFIED"){
            self._oMainController._oDatabase.find('stories', 'id', oHistoryItem.storyId(), function(oStory){
              // Set story featured image
              var sMinStoryImage = oStory.featuredImage();
              var sHistoryItemImage = oHistoryItem.extractedDNA().imageUrl();
              if (!sMinStoryImage || sMinStoryImage === ""
                && sHistoryItemImage !== ""){
                  oStory.setFeaturedImage(sHistoryItemImage);
              }
              // update story in db
              self._oMainController._oDatabase.put('stories', oStory,
                function(){});
            });
          } else {
            self._oMainController._oPool.putUnique(dHistoryItem);
          }
          if (self._oMainController._dGetContentTabId[sender.tab.id]){
            self._oMainController.removeGetContentTab(sender.tab.id);
            chrome.runtime.sendMessage({
              'action': 'refresh_item',
              'params': {
                'itemId': iId
              }
            });
          }
        }
      });
    },

  /**
   * When a getContent is performed.
   */
  'get_content_tab' : function(sendResponse, iTabId){
    this._oMainController.addGetContentTab(iTabId);
  },

  /**
   * Ligthyear asks for the story to display
   */
  'get_trigger_story' : function(sendResponse){
    sendResponse({
      'trigger_id': this._oMainController._iTriggerStory,
      'trigger_item_id': this._oMainController._iTriggerHistoryItem,
      'stories_in_tabs_id': this._oMainController._lStoriesInTabsId
    });
  },

  'pass_background_screenshot': function(sendResponse){
    sendResponse({'src': this._oMainController.screenshot()});
  },

  'change_story': function(sendResponse, iStoryId){
    var self = this;
    this._oMainController.setTriggerStory(iStoryId);
    this._oMainController.resetHistoryItem();
    this._oMainController.setOtherStories(function(){
      sendResponse({'stories_in_tabs_id': self._oMainController._lStoriesInTabsId});
    });
  },

  'delete_main_story': function(sendResponse){
    this._oMainController.setTriggerStory(null);
  }

});
