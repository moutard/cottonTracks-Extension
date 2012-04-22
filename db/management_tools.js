'use strict';

Cotton.DB.ManagementTools = {};
Cotton.DB.ManagementTools.dStores = {
    "stories" : "STORY_TRANSLATORS",
    "pool" : "HISTORY_ITEM_TRANSLATORS",
    "visitItems" : "VISIT_ITEM_TRANSLATORS",
};
// maybe add historyItem

Cotton.DB.ManagementTools.clearDB = function(){
  console.log("CLEAR DB");
  var lStores = _.keys(Cotton.DB.ManagementTools.dStores);
  for(var i = 0, sStore; sStore = lStores[i]; i++){
    var dStoreParameters = {};
    dStoreParameters[sStore] = Cotton.Translators[Cotton.DB.ManagementTools.dStores[sStore]];
    new Cotton.DB.Store('ct',
        dStoreParameters,
        function() {
         this.iterList('stories', function(oEntry) {
           this.delete(store, oEntry.id(), function(){
            console.log("entry deleted");
           });
         });
       });
  }
};

Cotton.DB.ManagementTools.clearStore = function(sStore){
  var lStores = _.keys(Cotton.DB.ManagementTools.dStores);
  if(_.include(lStores, sStore)){
    console.log("CLEAR Store " + sStore );
    var dStoreParameters = {};
    dStoreParameters[sStore] = Cotton.Translators[Cotton.DB.ManagementTools.dStores[sStore]];
      new Cotton.DB.Store('ct',
          dStoreParameters,
          function() {
           this.iterList(sStore, function(oEntry) {
             this.delete(sStore, oEntry.id(), function(){
              console.log("entry deleted");
             });
           });
         });
  } else {
    console.log("This store doesn't exist.");
  }
};

Cotton.DB.ManagementTools.listStore = function (sStore) {
  console.log('LIST ' + sStore);
  var dStoreParameters = {};
  dStoreParameters[sStore] = Cotton.Translators[Cotton.DB.ManagementTools.dStores[sStore]];
   new Cotton.DB.Store('ct',
       dStoreParameters,
       function() {
        this.iterList(sStore, function(oEntry){
          console.log(oEntry);
        });
       });

};

Cotton.DB.ManagementTools.listDB = function () {
  console.log('LIST');
   new Cotton.DB.Store('ct',
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
   new Cotton.DB.Store('ct',
       { 'stories': Cotton.Translators.STORY_TRANSLATORS },
       function() {
        this.listInverse('stories', function(oStory){
          mActionWithStory.call(self, oStory);
        });
       });
};

Cotton.DB.ManagementTools.addStories = function (lStories) {
  var oStore = new Cotton.DB.Store('ct',
        { 'stories': Cotton.Translators.STORY_TRANSLATORS },
        function() {
          console.log("store ready");
          for(var i = 0, oStory; oStory = lStories[i]; i++){
            oStore.put('stories', oStory, function() {
              console.log("Story added");
            });
          }
        }
      );
}

Cotton.DB.ManagementTools.addHistoryItems = function (lHistoryItems) {
   var oStore = new Cotton.DB.Store('ct',
        { 'historyItems': Cotton.Translators.HISTORY_ITEM_TRANSLATORS },
        function() {
          console.log("store ready");
          for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
            oStore.put('historyItems', oHistoryItem, function() {
              console.log("historyItem added");
            });
          }
        }
      );

}

Cotton.DB.ManagementTools.addStoriesByChronology = function(lStories) {
  var oStore = new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS
  }, function() {
      console.log("store ready");
      for(var i = lStories.length - 1, oStory; oStory = lStories[i]; i--){
        oStore.put('stories', oStory, function(iId) {
          console.log("Story added");
          // oStore.iterList('stories', function(oStory) {
          // console.log(oStory._lHistoryItems);
          // });
        });
      }
  });
};

Cotton.DB.ManagementTools.syncDatabaseWithChrome = function(){

  // TODO(rmoutard) : implement and launch each time Cotton is opened ?
};
