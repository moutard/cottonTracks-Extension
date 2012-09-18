'use strict';

/**
 * World class representing the whole interface.
 * Represents the View in a MVC pattern.
 */
Cotton.UI.World = Class.extend({

  /**
   * {Cotton.UI.StickyBar.Bar}
   */
  _oStickyBar : null,

  /**
   * {Cotton.UI.Story.Storyline}
   */
  _oStoryline : null,

  /**
   * {Cotton.UI.Homepage.Homepage}
   */
  _oHomepage : null,


  /**
   * @constructor
   */
  init : function() {
    var self = this;

    // Create stickybar
    self._oStickyBar = new Cotton.UI.StickyBar.Bar();

    // Create homepage
    self._oHomepage = Cotton.UI.Home.HOMEPAGE = new Cotton.UI.Home.Homepage();

    self._oStickyBar.on('ready', function() {
      console.log('world ready');

      // TODO(rmoutard) : not MVC compliant.
      Cotton.DB.Stories.getXStories(10, function(lStories) {
        // Populate the stickybar with the 10th last story.
        var lStickers = [];
        _.each(lStories, function(oStory) {
          var oSticker = self._oStickyBar.buildSticker(oStory);
          lStickers.push(oSticker);
        });

        _.each(lStickers, function(oSticker) {
          oSticker.display();
        });
      });
    });
  },

  /**
   * Note : this method is not really MVC friendly. Because the UI, has access
   * to the DB without passing by the controller.
   *
   * @this {World}
   */
  update : function() {
    console.log('world update');
    var self = this;
    Cotton.DB.Stories.getXStories(10, function(lStories) {
      // Various initializers, mostly for testing.
      var lStickers = [];
      _.each(lStories, function(oStory) {
        var oSticker = self._oStickyBar.buildSticker(oStory);
        lStickers.push(oSticker);
      });

      _.each(lStickers, function(oSticker) {
        oSticker.display();
      });
    });
  },

  /**
   *
   */
  pushStories : function(lStories) {
    var self = this;
    var lStickers = [];
    _.each(lStories, function(oStory) {
      var oSticker = self._oStickyBar.buildSticker(oStory);
      lStickers.push(oSticker);
    });

    _.each(lStickers, function(oSticker) {
      oSticker.display();
    });

  },
});

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
Cotton.UI.World.COMMUNICATOR = {};
_.extend(Cotton.UI.World.COMMUNICATOR, Backbone.Events);
