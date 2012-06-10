'use strict';

Cotton.DB.ManagementTools = {};
Cotton.DB.ManagementTools.dStores = {
    "stories" : "STORY_TRANSLATORS",
    // "pool" : "HISTORY_ITEM_TRANSLATORS",
    "visitItems" : "VISIT_ITEM_TRANSLATORS",
};
// maybe add historyItem

Cotton.DB.ManagementTools.clearDB = function(){
  console.log("CLEAR DB");
  var lStores = _.keys(Cotton.DB.ManagementTools.dStores);
  for(var i = 0, sStore; sStore = lStores[i]; i++){
    Cotton.DB.ManagementTools.clearStore(sStore);
  }
};

Cotton.DB.ManagementTools.purge = function(sStore, mCallBack){
  var dStoreParameters = {};
  dStoreParameters[sStore] = Cotton.Translators[Cotton.DB.ManagementTools.dStores[sStore]];
    new Cotton.DB.Store('ct',
        dStoreParameters,
        function() {
         this.purge(sStore, function() {
           mCallBack.call();
           console.log("purge ok");
         });
       });
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

Cotton.DB.ManagementTools.poeut = function(lStories){
  new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS
  }, function() {
    this.putList('stories', lStories, function(lAllId) {
      console.log("Stories added");
      console.log(lAllId);
      Cotton.UI.oWorld.update();
    });
  });
};

Cotton.DB.ManagementTools.addStoriesByChronology = function(lStories) {
  console.log("Add Stories by chronology");
  var startTime = new Date().getTime();
  var elapsedTime = 0;
  var oStore = new Cotton.DB.Store('ct', {
    'stories' : Cotton.Translators.STORY_TRANSLATORS
  }, function() {
      console.log("store ready");
      elapsedTime = (new Date().getTime() - startTime) / 1000;
      console.log("@@Time to create stories store " + elapsedTime + "s");
      var i;
      for(i = 0; i < lStories.length; i++){
        var oStory = lStories[lStories.length - 1 - i];
        this.put('stories', oStory, function(iId) {
          console.log("Story added");
        });
      }
      setTimeout(function(){
        console.log('rere');
        Cotton.UI.oWorld.update();
      }, 1000);
  });
};

Cotton.DB.ManagementTools.syncDatabaseWithChrome = function(){

  // TODO(rmoutard) : implement and launch each time Cotton is opened ?
};

Cotton.DB.ManagementTools.test = function(){

  var oStore = new Cotton.DB.Store('ct', {
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
  }, function() {
    console.log("store ready");

      var oVisitItem = new Cotton.Model.VisitItem();
      oVisitItem._sId = 188;
      oVisitItem._sUrl = "http://digitaldraft.fr";
      oVisitItem._sTitle = "Raphael";
      oVisitItem._iVisitTime = new Date().getTime();
      // ._sReferrerUrl = document.referrer;
      console.log(oVisitItem);
      oStore.put('visitItems', oVisitItem, function(iId) {
        console.log(iId);
      });
  });
};


Cotton.DB.ManagementTools.test2 = function(){

  var oStore = new Cotton.DB.Store('ct', {
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
  }, function() {
    console.log("store ready");
      oStore.getLastEntry('visitItems', function(oVisitItem){
        oVisitItem._sTitle = "poeueuet";
        oStore.put('visitItems', oVisitItem, function(iId) {
          console.log(iId);
        });
      });

  });
};


Cotton.DB.ManagementTools.test3 = function(){
  var u;
  var oStore = new Cotton.DB.Store('ct', {
    'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
  }, function() {
    console.log("store ready");
      oStore.getLastEntry('visitItems', function(oVisitItem){
        oVisitItem._sId = 187;
        oVisitItem._sTitle = "encore";
        oVisitItem._oExtractedDNA._fPageScore = 2;
        oStore.put('visitItems', oVisitItem, function(iId) {
          console.log(iId);
        });
      });

  });

};
