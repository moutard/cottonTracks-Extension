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

  /**
   * Send by a content_script, each time a new tab is open or
   * parser has updated informations.
   *
   * Available params :
   * request['params']['historyItem']
   */
  'create_history_item' : function(sendResponse, dHistoryItem){
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
            _.each(lSearchKeywords, function(oSearchKeyword){
              lStoriesId = _.union(lStoriesId, oSearchKeyword.referringStoriesId());
            });

            // Find the story that is the closest to the historyItem.
            self._oMainController._oDatabase.findGroup('stories', 'id',
              lStoriesId, function(lStories){
                // Cosine higher -> story closer.
                // FIXME(rmoutard) : find a real value for this !
                var iMaxCosine = 10;
                var oMinStory = undefined;
                _.each(lStories, function(oStory){
                  var iCurrentDistance = Cotton.Algo.Distance.historyItemToStory(
                    oHistoryItem, oStory);
                  if(iCurrentDistance > iMaxCosine){
                    oMinStory = oStory;
                    iMaxCosine = iCurrentDistance;
                  }
                });

                // If we find a min story put the historyItem in it.
                if(oMinStory){
                  oHistoryItem.setStoryId(oMinStory.id());
                    self._oMainController._oDatabase.putUniqueHistoryItem('historyItems',
                      oHistoryItem, function(iHistoryItemId){
                        oMinStory.addHistoryItemId(iHistoryItemId);
                        self._oMainController._oDatabase.put('stories',
                          oMinStory, function(){});
                      });

                } else {
                  // Put the history item in the pool.
                  self._oMainController._oPool.put(dHistoryItem);
                  // Lauch dbscan2 on the pool.
                  var wDBSCAN2 = self._oMainController.initWorkerDBSCAN2();
                  wDBSCAN2.postMessage(self._oMainController._oPool.get());
                }
            });
        });

        // you want to create it for the first time.
        self._oMainController._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId) {
          DEBUG && console.debug("historyItem added" + iId);
          sPutId = iId;
          var _iId = iId;
          _.each(oHistoryItem.searchKeywords(), function(sKeyword){
            var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
            oSearchKeyword.addReferringHistoryItemId(_iId);
            self._oMainController._oDatabase.putUniqueKeyword('searchKeywords',
              oSearchKeyword, function(iiId){
                // Return nothing to let the connection be cleaned up.
              });

          });
          sendResponse({
            'received' : "true",
            'id' : sPutId,
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

      // Put the historyItem only if it's not a Tool, and it's not in the exluded
      // urls.
      // TODO (rmoutard) : parseUrl is called twice. avoid that.
      if (!oExcludeContainer.isExcluded(oHistoryItem.url())) {
          // The history item already exists, just update it.
          self._oMainController._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId) {
            DEBUG && console.debug("Messaging - historyItem updated" + iId);
          });
      } else {
        DEBUG && console
            .debug("Content Script Listener - This history item is a tool or an exluded url.");
      }
    },

});