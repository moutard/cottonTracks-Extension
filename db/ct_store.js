'use strict';

var oSingletonStore;

Cotton.DB.CTStore = Class.extend(){
  init: function(mCallBack){
    if(!oSingletonStore){
      oSingletonStore =  new Cotton.DB.Store('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
          }, function() {
            mCallBack();
          });

    }
    else {
      return oSingletonStore;
    }
  }
}

