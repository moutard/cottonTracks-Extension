'use strict';

/**
 * World class representing the whole interface.
 * Represents the View in a MVC pattern.
 */
Cotton.UI.World = Class.extend({
	/**
   * Story container
   */
	_oStoryContainer: null,

  /**
   * @constructor
   */
  init : function() {
    var self = this;
    this._oStoryContainer = new Cotton.UI.StoryContainer();
    this._oSideMenu = new Cotton.UI.Menu.MenuSumUp();
  },

});

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
Cotton.UI.World.COMMUNICATOR = {};
_.extend(Cotton.UI.World.COMMUNICATOR, Backbone.Events);