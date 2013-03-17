'use strict';

Cotton.DB.ManagementTools = {};
Cotton.DB.ManagementTools.dStores = {
    "stories" : "STORY_TRANSLATORS",
    "historyItems" : "HISTORY_ITEM_TRANSLATORS",
    "searchKeywords" : "SEARCH_KEYWORDS_TRANSLATORS",
};

Cotton.DB.ManagementTools.createStory = function(sTitle, sFeaturedImage){
  var self = this;
  var oStory = new Cotton.Model.Story();
  oStory.setTitle(sTitle);
  oStory.setFeaturedImage(sFeaturedImage);
  oStory.setLastVisitTime(new Date().getTime());
  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  }, function() {
    self._oDatabase.put('stories', oStory, function(iId){
      console.log(iId);
    });
  });
};

Cotton.DB.ManagementTools.createStoryFromList = function(sTitle, sFeaturedImage,
    lHistoryItems){
  var self = this;
  var oStory = new Cotton.Model.Story();
  oStory.setTitle(sTitle);
  oStory.setFeaturedImage(sFeaturedImage);
  oStory.setLastVisitTime(new Date().getTime());
  var lHistoryItemsId = [];
  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS,
  }, function() {
    for(var i = 0, dHistoryItem; dHistoryItem = lHistoryItems[i]; i++){
      //var oTranslator = self._oDatabase._translatorForDbRecord('historyItems', dHistoryItem);
      //var oHistoryItem = oTranslator.
      var oHistoryItem = new Cotton.Model.HistoryItem();
      oHistoryItem.setLastVisitTime(dHistoryItem['iLastVisitTime']);
      oHistoryItem.setTitle(dHistoryItem['sTitle']);
      oHistoryItem.initUrl(dHistoryItem['sUrl']);
      self._oDatabase.putUniqueHistoryItem('historyItems', oHistoryItem, function(iId){
        var _iId = iId;
        console.log(_iId);
        lHistoryItemsId.push(_iId);
        console.log(lHistoryItemsId.length + '' + lHistoryItems.length);
        if(lHistoryItemsId.length === lHistoryItems.length){
            var oStory = new Cotton.Model.Story();
            oStory.setTitle(sTitle);
            oStory.setFeaturedImage(sFeaturedImage);
            oStory.setLastVisitTime(new Date().getTime());
            oStory._lHistoryItemsId = lHistoryItemsId;
            self._oDatabase.put('stories', oStory, function(iStoryId){
              console.log(iStoryId);
              console.log('story created');

              var lList = sTitle.split(' ');
              for(var i=0, sKeyword; sKeyword = lList[i]; i++){
                var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
                oSearchKeyword.addReferringStoryId(iStoryId);
                self._oDatabase.putUniqueKeyword('searchKeywords',oSearchKeyword,
                  function(){
                });
              }
            });
        }
      });
    }
  });
};


Cotton.DB.ManagementTools.addHistoryItemToStory = function(iStoryId, iHistoryItemId){
  var self = this;

  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
  }, function() {
    self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
      oStory.addHistoryItemId(iHistoryItemId);
      self._oDatabase.put('stories', oStory, function(){
        console.log('historyItem added.');
      });
    });
  });
};

Cotton.DB.ManagementTools.setStoryBagOfWords = function(iStoryId, dBagOfWords){
  var self = this;

  self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS,
    'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS,
  }, function() {
    self._oDatabase.find('stories', 'id', iStoryId, function(oStory){
      oStory.dna().bagOfWords().setBag(dBagOfWords);
      self._oDatabase.put('stories', oStory, function(){
        console.log('bagOfWords updated.');
        for(var sKey in dBagOfWords){
          var oSearchKeyword = new Cotton.Model.SearchKeyword(sKey);
          oSearchKeyword.addReferringStoryId(iStoryId);
          self._oDatabase.putUniqueKeyword('searchKeywords', oSearchKeyword,
            function(){
              console.log('searchKeywords updated.');
            });
        }
      });
    });
  });
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
