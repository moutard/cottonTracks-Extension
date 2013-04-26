'use strict';

/**
 * Related stories
 */
Cotton.UI.RelatedStories.Stories = Class.extend({

  init : function(lStories){
    this._lRelatedStories = lStories
    console.log(lStories);
  },

  show : function(){
    console.log(this._lRelatedStories);
  }

});