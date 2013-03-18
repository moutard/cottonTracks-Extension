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
    for (var i = 0, lKeywords = oHistoryItem.searchKeywords(), iLength = lKeywords.length;
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

      // TODO(rmoutard) : use DB system, or a singleton.
      var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

      var sPutId = ""; // put return the auto-incremented id in the database.

      // Put the historyItem only if it's not a Tool, and it's not in the exluded
      // urls.
      // TODO (rmoutard) : parseUrl is called twice. avoid that.
      if (!oExcludeContainer.isExcluded(oHistoryItem.url())) {
        // See if the history items can fit in a story.
        var lPreponderantKeywords = oHistoryItem.extractedDNA().bagOfWords().preponderant(3);
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
                // Cosine higher -> story closer.
                // FIXME(rmoutard) : find a real value for this !
                var iMaxCosine = 10;
                var oMinStory = undefined;
                for (var i = 0, iLength = lStories.length; i < iLength; i++) {
                  var oStory = lStories[i];
                  var iCurrentDistance = Cotton.Algo.Distance.historyItemToStory(
                    oHistoryItem, oStory);
                  if(iCurrentDistance > iMaxCosine){
                    oMinStory = oStory;
                    iMaxCosine = iCurrentDistance;
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
                  });
                  // There is a story for this item, so enable the browserAction
                  // and attach a storyId to the tab
	          chrome.browserAction.enable(sender.tab.id);
                  self._oMainController.setTabStory(sender.tab.id, oMinStory.id());

                } else {
                  self._oMainController._oDatabase.putUniqueHistoryItem('historyItems',
                    oHistoryItem, function(iHistoryItemId){
		      DEBUG && console.debug("historyItem added" + iHistoryItemId);
		      sPutId = iHistoryItemId;
		      dHistoryItem['id'] = sPutId;
	              self.addSearchKeywordsToDb(oHistoryItem, iHistoryItemId);
	              // Put the history item in the pool.
                      self._oMainController._oPool.put(dHistoryItem);
                      // Lauch dbscan2 on the pool.
                      var wDBSCAN2 = self._oMainController.initWorkerDBSCAN2();
                      wDBSCAN2.postMessage(self._oMainController._oPool.get());
                  });
                }

                sendResponse({
                  'received' : "true",
                  'id' : sPutId,
                });
            });
        });

      } else {
        DEBUG && console
            .debug("Content Script Listener - This history item is a tool or an exluded url.");
      }
  },

  /**
   * When the reading rater has modified the dna.
   */
  'update_history_item' : function(sendResponse, dHistoryItem, sender){
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

      // Put the historyItem only if it's not a Tool, and it's not in the exluded
      // urls.
      // TODO (rmoutard) : parseUrl is called twice. avoid that.
      if (!oExcludeContainer.isExcluded(oHistoryItem.url())) {
          // The history item already exists, just update it.
          self._oMainController._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId) {
            DEBUG && console.debug("Messaging - historyItem updated" + iId);
            if (self._oMainController._dGetContentTabId[sender.tab.id] === true){
              console.log(iId);
              self._oMainController.removeGetContentTab(sender.tab.id);
              chrome.extension.sendMessage({
                'action': 'refresh_item',
                'params': {
                  'itemId': iId
                }
              });
            }
          });
      } else {
        DEBUG && console
            .debug("Content Script Listener - This history item is a tool or an exluded url.");
      }
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
      'trigger_id': this._oMainController._iTriggerStory
    });
  },

  'pass_background_screenshot': function(sendResponse){
    sendResponse({'src': this._oMainController.screenshot()});
  }

});
