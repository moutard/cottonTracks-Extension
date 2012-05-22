'use strict';

// World class representing the whole interface.
Cotton.UI.World = function() {
  var oStickyBar = this._ostickyBar = new Cotton.UI.StickyBar.Bar();
  var object = {};
  oStickyBar.on('ready', function() {

    Cotton.DBSCAN2.getXStories(10, function(lStories) {
      // Various initializers, mostly for testing.
      var lStickers = [];
      _.each(lStories, function(oStory) {
        var oSticker = oStickyBar.buildSticker(oStory);
        lStickers.push(oSticker);
      });

      _.each(lStickers, function(oSticker) {
        oSticker.display();
      });
    });
  });
  
  Cotton.UI.Homepage.GRID = new Cotton.UI.Homepage.Grid();
  $('.ct-iconButton_home').click(function() {
    Cotton.UI.Homepage.GRID.show();
  });
};

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
Cotton.UI.World.COMMUNICATOR = {};
_.extend(Cotton.UI.World.COMMUNICATOR, Backbone.Events);

$.extend(Cotton.UI.World.prototype, {
  update : function() {
    var self = this;
    Cotton.DBSCAN2.getXStories(10, function(lStories) {
      // Various initializers, mostly for testing.
      var lStickers = [];
      _.each(lStories, function(oStory) {
        var oSticker = self._ostickyBar.buildSticker(oStory);
        lStickers.push(oSticker);
      });

      _.each(lStickers, function(oSticker) {
        oSticker.display();
      });
    });
  },
});
