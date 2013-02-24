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
  },
  
  container: function() {
    return this._$container;
  },
  
});

_.extend(Cotton.UI.StoryContainer.prototype, Backbone.Events);