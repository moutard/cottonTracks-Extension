'use strict';

Cotton.UI.StoryContainer = Class.extend({

  /**
   * {Cotton.DB.Store}
   */
  _oDatabase : null,
  
  _$storyContainer : null,
  
  init: function(){
	  var self = this;
  	this._$storyContainer = $('.ct-story_container');
		this.buildStory();
  },
  
  container: function() {
    return this._$storyContainer;
  },

  buildStory: function() {
		self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      self._oDatabase.getLast('stories', 'fLastVisitTime', function(oLastStory) {
        self._oDatabase.findGroup('visitItems', 'id', oLastStory.visitItemsId(), function(lVisitItems) {
		      _.each(lVisitItems,function(oVisitItem){
						var oItem = new Cotton.UI.Story.Item.Element(oVisitItem);
					});
				});
      });
    });
}
  
});

_.extend(Cotton.UI.StoryContainer.prototype, Backbone.Events);