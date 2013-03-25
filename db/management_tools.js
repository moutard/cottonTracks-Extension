'use strict';

Cotton.DB.ManagementTools = {};
Cotton.DB.ManagementTools.dStores = {
    "stories" : "STORY_TRANSLATORS",
    "historyItems" : "HISTORY_ITEM_TRANSLATORS",
    "searchKeywords" : "SEARCH_KEYWORD_TRANSLATORS",
};

/**
 * Purge the whole database, eliminate all the stores listed in
 * Cotton.DB.ManagementTools.dStores
 */
Cotton.DB.ManagementTools.purgeDB = function(){
  console.log("PURGE DB");
  var lStores = _.keys(Cotton.DB.ManagementTools.dStores);
  for(var i = 0, sStore; sStore = lStores[i]; i++){
    Cotton.DB.ManagementTools.purgeStore(sStore);
  }
};

/**
 * Purge a given store.
 * @param {String} sStore : name of the store.
 *  Should be in Cotton.DB.ManagementTools.dStores
 */
Cotton.DB.ManagementTools.purgeStore = function(sStore, mCallBack){
  var dStoreParameters = {};
  dStoreParameters[sStore] = Cotton.Translators[Cotton.DB.ManagementTools.dStores[sStore]];
    new Cotton.DB.IndexedDB.Wrapper('ct',
        dStoreParameters,
        function() {
         this.purge(sStore, function() {
           mCallBack.call();
           console.log("purge ok");
         });
       });
};

/**
 * List a given store.
 * @param {String} sStore : store name.
 */
Cotton.DB.ManagementTools.listStore = function(sStore) {
  console.log('LIST ' + sStore);
  var dStoreParameters = {};
  dStoreParameters[sStore] = Cotton.Translators[Cotton.DB.ManagementTools.dStores[sStore]];
   new Cotton.DB.IndexedDB.Wrapper('ct',
       dStoreParameters,
       function() {
        this.iterList(sStore, function(oEntry){
          console.log(oEntry);
        });
       });

};

Cotton.DB.ManagementTools.listDB = function () {
  console.log('LIST');
   new Cotton.DB.IndexedDB.Wrapper('ct',
       { 'stories': Cotton.Translators.STORY_TRANSLATORS },
       function() {
        console.log("store ready");
        this.iterList('stories', function(oStory){
          console.log(oStory);
        });
       });

};

Cotton.DB.ManagementTools.printDB = function (mActionWithStory) {
  var self = this;
  console.log('PRINT');
   new Cotton.DB.IndexedDB.Wrapper('ct',
       { 'stories': Cotton.Translators.STORY_TRANSLATORS },
       function() {
        this.listInverse('stories', function(oStory){
          mActionWithStory.call(self, oStory);
        });
       });
};

// Get all historyItems in a list of dictionnaries, and do what you want
// with it through a callback
Cotton.DB.ManagementTools.dumpHistoryItems = function (mActionWithItems) {
  var self = this;
  var lDbRecord = [];
  new Cotton.DB.IndexedDB.Wrapper('ct',
    { 'historyItems': Cotton.Translators.HISTORY_ITEM_TRANSLATORS },
    function(){
      this.getList('historyItems', function(lHistoryItems){
        for (var i = 0, iLength = lHistoryItems.length; i < iLength; i++) {
          var oTranslator = this._lastTranslator('historyItems');
          var oHistoryItem = lHistoryItems[i];
          var dDbRecord = oTranslator.objectToDbRecord(oHistoryItem);
          lDbRecord.push(dDbRecord);
        }
        mActionWithItems(lDbRecord);
      });
  });
};

// Dumps all historyItems in a file that downloads
Cotton.DB.ManagementTools.dumpHistoryItemsInFile = function () {
  Cotton.DB.ManagementTools.dumpHistoryItems(function(lDbRecord){
    var sRecord = JSON.stringify(lDbRecord);
    var sUriContent = "data:application/octet-stream," + encodeURIComponent(sRecord);
    window.open(sUriContent, 'historyItemsFile');
  });
};
