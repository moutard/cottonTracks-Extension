'use strict';

// World class representing the whole interface.
Cotton.UI.World = function() {
  var oStickyBar = this._ostickyBar = new Cotton.UI.StickyBar.Bar();
  var object = {};
  oStickyBar.on('ready', function() {
    
    Cotton.DBSCAN2.getStories(function(lStories) {
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
};

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
Cotton.UI.World.COMMUNICATOR = {};
_.extend(Cotton.UI.World.COMMUNICATOR, Backbone.Events);

$.extend(Cotton.UI.World.prototype, {
  
});
