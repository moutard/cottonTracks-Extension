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
   * request['params']['visitItem']
   */
  'create_visit_item' : function(sendResponse, dVisitItem){
      var self = this;
      /**
       * Because Model are compiled in two different way by google closure
       * compiler we need a common structure to communicate throught messaging.
       * We use dbRecord, and translators give us a simple serialisation process.
       */
      var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
      var oTranslator = lTranslators[lTranslators.length - 1];
      var oVisitItem = oTranslator.dbRecordToObject(dVisitItem);
      DEBUG && console.debug("Messaging - create_visit_item");
      DEBUG && console.debug(oVisitItem.url());

      // TODO(rmoutard) : use DB system, or a singleton.
      var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

      var sPutId = ""; // put return the auto-incremented id in the database.

      // Put the visitItem only if it's not a Tool, and it's not in the exluded
      // urls.
      // TODO (rmoutard) : parseUrl is called twice. avoid that.
      if (!oExcludeContainer.isExcluded(oVisitItem.url())) {
          // you want to create it for the first time.
          self._oMainController._oDatabase.put('visitItems', oVisitItem, function(iId) {
            DEBUG && console.debug("visitItem added" + iId);
            sPutId = iId;
            var _iId = iId;
            _.each(oVisitItem.searchKeywords(), function(sKeyword){
              // PROBLEM if not find.
             self._oMainController._oDatabase.find('searchKeywords', 'sKeyword', sKeyword, function(oSearchKeyword){
                if(!oSearchKeyword) {
                  oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
                }

                oSearchKeyword.addReferringVisitItemId(_iId);

                self._oMainController._oDatabase.put('searchKeywords', oSearchKeyword, function(iiId){
                  // Return nothing to let the connection be cleaned up.
                });
              });
            });
            sendResponse({
              'received' : "true",
              'id' : sPutId,
            });

          });

      } else {
        DEBUG && console
            .debug("Content Script Listener - This visit item is a tool or an exluded url.");
      }
  },

  /**
   * When the reading rater has modified the dna.
   */
  'update_visit_item' : function(sendResponse, dVisitItem){
      var self = this;
      /**
       * Because Model are compiled in two different way by google closure
       * compiler we need a common structure to communicate throught messaging.
       * We use dbRecord, and translators give us a simple serialisation process.
       */
      var lTranslators = Cotton.Translators.VISIT_ITEM_TRANSLATORS;
      var oTranslator = lTranslators[lTranslators.length - 1];
      var oVisitItem = oTranslator.dbRecordToObject(dVisitItem);
      DEBUG && console.debug("Messaging - update_visit_item");
      DEBUG && console.debug(oVisitItem.url());
      // TODO(rmoutard) : use DB system, or a singleton.
      var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

      var sPutId = ""; // put return the auto-incremented id in the database.

      // Put the visitItem only if it's not a Tool, and it's not in the exluded
      // urls.
      // TODO (rmoutard) : parseUrl is called twice. avoid that.
      if (!oExcludeContainer.isExcluded(oVisitItem.url())) {
          // The visit item already exists, just update it.
          self._oMainController._oDatabase.put('visitItems', oVisitItem, function(iId) {
            DEBUG && console.debug("Messaging - visitItem updated" + iId);
          });
      } else {
        DEBUG && console
            .debug("Content Script Listener - This visit item is a tool or an exluded url.");
      }
    },

});
