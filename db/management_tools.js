'use strict';

Cotton.DB.ManagementTools = {};


Cotton.DB.ManagementTools.clearDB = function(){
  console.log("CLEAR");
   new Cotton.DB.Store('ct',
       { 'stories': Cotton.Translators.STORY_TRANSLATORS },
       function() {
        this.list('stories', function(oStory) {
          this.delete('stories', oStory, function(){
           console.log("story deleted" + oStory.id());

          });
        });
      });
};

Cotton.DB.ManagementTools.listDB = function () {
  console.log('LIST');
   new Cotton.DB.Store('ct',
       { 'stories': Cotton.Translators.STORY_TRANSLATORS },
       function() {
        this.list('stories', function(oStory){
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
