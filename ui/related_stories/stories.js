'use strict';

/**
 * Related stories
 */
Cotton.UI.RelatedStories.Stories = Class.extend({

  _$related_container : null,
  _lRelatedStories : null,

  init : function(lStories){
    this._lRelatedStories = lStories
    this._$related_container = $('<div class="ct-related_container"></div>');
  },

  $ : function(){
    return this._$related_container;
  },

  show : function(){
    this._$related_container.removeClass('hidden');
  }

});