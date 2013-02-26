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
  },
  
  container: function() {
    return this._$storyContainer;
  },
  
});

_.extend(Cotton.UI.StoryContainer.prototype, Backbone.Events);