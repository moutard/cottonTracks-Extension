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
  doAction : function(sAction, lArguments) {
    this[sAction].apply(this, lArguments);
  },

  addHistoryItemSearchKeywords : function(oHistoryItem, iHistoryItemId) {
    var self = this;
    var lKeywords = _.keys(oHistoryItem.extractedDNA().bagOfWords().get());
    var iLength = lKeywords.length;
    for (var i = 0; i < iLength; i++){
      var sKeyword = lKeywords[i];
      var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
      oSearchKeyword.addReferringHistoryItemId(iHistoryItemId);
      self._oMainController._oDatabase.putUnique('searchKeywords',
        oSearchKeyword, function(iKeywordId){
          // Return nothing to let the connection be cleaned up.
      });
    }
  },

  addStoryToSearchKeywords : function(oStory) {
    var self = this;
    var lKeywords = _.keys(oStory.dna().bagOfWords().get());
    var iLength = lKeywords.length;
    for (var i = 0; i < iLength; i++){
      var sKeyword = lKeywords[i];
      var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
      oSearchKeyword.addReferringStoryId(oStory.id());
      self._oMainController._oDatabase.putUnique('searchKeywords',
        oSearchKeyword, function(iKeywordId){
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
  'create_history_item' : function(sendResponse, dHistoryItem){
      var self = this;
      Cotton.ANALYTICS.newVisitItem();
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
      oHistoryItem = Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(oHistoryItem);
      //compute closest searchpage with searchcache
      oHistoryItem = Cotton.Algo.findClosestSearchPage(
          oHistoryItem, self._oMainController._oSearchCache);
      oHistoryItem.extractedDNA().setMinWeightForWord();
      dHistoryItem = oTranslator.objectToDbRecord(oHistoryItem);

      if (oHistoryItem.oUrl().keywords){
        self._oMainController._oSearchCache.putUnique(dHistoryItem, 'sUrl', oTranslator.mergeDBRecords());
      }

      var sPutId = ""; // put return the auto-incremented id in the database.

      self._oMainController._oDatabase.find('historyItems',
        'sUrl', oHistoryItem.url(), function(_oHistoryItem){
          if (_oHistoryItem){
            oHistoryItem.incrementVisitCount(_oHistoryItem.visitCount());
            // increment the visitCount of the dItem in case it goes in the pool
            dHistoryItem['iVisitCount'] += _oHistoryItem.visitCount();
          }
          if(_oHistoryItem && _oHistoryItem.storyId() !== "UNCLASSIFIED" ){
            // update lastVisitTime for the story
            self._oMainController._oDatabase.find('stories', 'id', _oHistoryItem.storyId(), function(oStory){
              oStory.setLastVisitTime(oHistoryItem.lastVisitTime());
              self._oMainController._oDatabase.put('stories', oStory, function(oStory){});
            });
            // set the story id for the new item..
            oHistoryItem.setStoryId(_oHistoryItem.storyId());
            // ..then update the item in base
            self._oMainController._oDatabase.putUnique('historyItems',
              oHistoryItem, function(iHistoryItemId){});
            // There is a story for this item, so enable the browserAction
            // and attach a storyId to the tab
            sPutId = _oHistoryItem.id();
            sendResponse({
              'id' : sPutId,
              'storyId' : oHistoryItem.storyId()
            });
          } else {
            Cotton.ANALYTICS.newHistoryItem();
            // See if the history items can fit in a story.
            // take keywords in bag of words with the highest score
            var lPreponderantKeywords = oHistoryItem.extractedDNA().bagOfWords().preponderant(
              Cotton.Config.Parameters.iNumberOfPreponderantKeywords);
            self._oMainController._oDatabase.findGroup('searchKeywords',
              'sKeyword', lPreponderantKeywords, function(lSearchKeywords){
                var lStoriesId = [];
                var iLength = lSearchKeywords.length;
                for (var i = 0; i < iLength; i++){
                  var oSearchKeyword = lSearchKeywords[i];
                  lStoriesId = _.union(lStoriesId, oSearchKeyword.referringStoriesId());
                }

                // Find the story that is the closest to the historyItem.
                self._oMainController._oDatabase.findGroup('stories', 'id',
                  lStoriesId, function(lStories){
                    var iMaxScore = Cotton.Config.Parameters.dbscan2.iMaxScore;
                    var oMinStory = undefined;
                    var iLength = lStories.length;
                    for (var i = 0; i < iLength; i++) {
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
                      self._oMainController._oDatabase.putUnique('historyItems',
                        oHistoryItem, function(iHistoryItemId){
                          DEBUG && console.debug("historyItem added" + iHistoryItemId);
                          sPutId = iHistoryItemId;
                          self.addHistoryItemSearchKeywords(oHistoryItem, iHistoryItemId);
                          oMinStory.addHistoryItemId(iHistoryItemId);
                          oMinStory.setLastVisitTime(oHistoryItem.lastVisitTime());
                          self._oMainController._oDatabase.put('stories', oMinStory,
                            function(){});
                          sendResponse({
                            'id' : sPutId,
                            'storyId' : oHistoryItem.storyId()
                          });
                      });
                      oMinStory.dna().bagOfWords().mergeBag(
                        oHistoryItem.extractedDNA().bagOfWords().get());
                      self.addStoryToSearchKeywords(oMinStory);
                      self._oMainController._oDatabase.put(
                        'stories', oMinStory, function(iStoryId){});
                    } else {
                      self._oMainController._oDatabase.putUnique('historyItems',
                        oHistoryItem, function(iHistoryItemId){
                          DEBUG && console.debug("historyItem added" + iHistoryItemId);
                          sPutId = iHistoryItemId;
                          dHistoryItem['id'] = sPutId;
                          self.addHistoryItemSearchKeywords(oHistoryItem, iHistoryItemId);
                          // Put the history item in the pool.
                          self._oMainController._oPool.putUnique(dHistoryItem, 'sUrl', oTranslator.mergeDBRecords());
                          // Lauch dbscan2 on the pool.
                          var wDBSCAN2 = self._oMainController.initWorkerDBSCAN2();
                          wDBSCAN2.postMessage({
                            'pool': self._oMainController._oPool.get()
                          });
                          sendResponse({
                            'id' : sPutId,
                            'storyId' : oHistoryItem.storyId()
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
  'update_history_item' : function(sendResponse, dHistoryItem){
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

      self._oMainController._oDatabase.find('historyItems', 'id', oHistoryItem.id(), function(oDbHistoryItem){
        if (oDbHistoryItem.storyId() !== "UNCLASSIFIED"){
          oHistoryItem.setStoryId(oDbHistoryItem.storyId());
        }
        // The history item already exists, just update it.
        self._oMainController._oDatabase.putUnique('historyItems', oHistoryItem, function(iId) {
          DEBUG && console.debug("Messaging - historyItem updated" + iId);
          if (oHistoryItem.storyId() !== "UNCLASSIFIED"){
            self._oMainController._oDatabase.find('stories', 'id', oHistoryItem.storyId(), function(oStory){
              // Set story featured image
              var sMinStoryImage = oStory.featuredImage();
              var sHistoryItemImage = oHistoryItem.extractedDNA().imageUrl();
              if (!sMinStoryImage && sHistoryItemImage) {
                oStory.setFeaturedImage(sHistoryItemImage);
              }
              // update story lastVisitTime
              oStory.setLastVisitTime(oHistoryItem.lastVisitTime());
              // update story in db
              self._oMainController._oDatabase.put('stories', oStory,
                function(){});
            });
          } else {
            self._oMainController._oPool.putUnique(dHistoryItem, 'sUrl', oTranslator.mergeDBRecords());
          }
        });
      });
    },

    'switch_to_proto' : function(sendResponse) {
      sendResponse();
      setTimeout(function(){chrome.browserAction.onClicked.dispatch()}, 100);
    }

});
