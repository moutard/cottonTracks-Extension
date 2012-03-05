'use strict';

Cotton.DB.ManagementTools = {};

Cotton.DB.ManagementTools.clearDB = function(){
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

Cotton.DB.ManagementTools.listDB = function(){
  console.log('LIST');
   new Cotton.DB.Store('ct', 
       { 'stories': Cotton.Translators.STORY_TRANSLATORS }, 
       function() {
        this.list('stories', function(oStory){
          console.log(oStory);
        });
       });

};
