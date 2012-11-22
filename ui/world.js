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
   * {Cotton.UI.Home.Homepage}
   */
  _oHomepage : null,

  /**
   * {Cotton.UI.Search.Searchpage}
   */
  _oSearchpage : null,

  /**
   * {Cotton.UI.Curtain}
   */
  _oCurtain : null,

  /**
   * @constructor
   */
  init : function() {
    var self = this;

    Cotton.UI.oCurtain = self._oCurtain = new Cotton.UI.Curtain(window);
    Cotton.UI.oErrorHandler.setCurtain(Cotton.UI.oCurtain);
    // If it's not the first time curtain is already open.
    $('body').addClass('ct-body-loaded');
    if (localStorage['CottonFirstOpening'] === undefined
              || localStorage['CottonFirstOpening'] === "true") {
      self._oCurtain.show();
      Cotton.UI.oErrorHandler.startTimeoutError();

    } else {
      self._oCurtain.open();
    }

    // Create stickybar
    self._oStickyBar = new Cotton.UI.StickyBar.Bar(self);

    // Create homepage
    self._oHomepage = Cotton.UI.Home.HOMEPAGE = new Cotton.UI.Home.Homepage(self);
    self._oSearchpage = Cotton.UI.Search.SEARCHPAGE = new Cotton.UI.Search.Searchpage(self);

    self._oStoryline = _oCurrentlyOpenStoryline;

    self._oStickyBar.on('ready', function() {
      LOG && console.log('world ready');

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

  stickyBar : function(){
    return this._oStickyBar;
  },

  storyline : function(){
    return this._oStoryline;
  },

  homepage : function(){
    return this._oHomepage;
  },

  searchpage : function(){
    return this._oSearchpage;
  },

  curtain : function(){
    return this._oCurtain;
  },

  reset : function(){
    var self = this;
    Cotton.UI.Story.Storyline.removeAnyOpenStoryline();
    self._oHomepage.hide();
    self._oSearchpage.hide();
  },

  /**
   * Note : this method is not really MVC friendly. Because the UI, has access
   * to the DB without passing by the controller.
   *
   * @this {World}
   */
  update : function() {
    LOG && console.log('world update');
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

});

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
Cotton.UI.World.COMMUNICATOR = {};
_.extend(Cotton.UI.World.COMMUNICATOR, Backbone.Events);
