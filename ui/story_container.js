'use strict';

Cotton.UI.StoryContainer = Class.extend({

  /**
   * {Cotton.DB.Store}
   */
  _oStore : null,
  
  _$story_container : null,
  
  init: function(){
	  var self = this;
  	this._$story_container = $('.ct-story_container');
		this.buildStory();
  },
  
  container: function() {
    return this._$container;
  },

  buildStory: function() {
		self._oStore = new Cotton.DB.StoreIndexedDB('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      self._oStore.getLast('stories', 'fLastVisitTime', function(oLastStory) {
        DEBUG && console.debug(oLastStory);
        DEBUG && console.debug(oLastStory.id());
        self._oStore.findGroup('visitItems', 'id', oLastStory.visitItemsId(), function(lVisitItems) {
		      DEBUG && console.debug(lVisitItems);
		  		DEBUG && console.debug(lVisitItems[0].storyId());
				});
      });
    });
}
  
});

_.extend(Cotton.UI.StoryContainer.prototype, Backbone.Events);