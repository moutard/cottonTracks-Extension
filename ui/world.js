'use strict';

// World class representing the whole interface.
UI.World = function() {
  var oStickyBar = this._ostickyBar = new UI.StickyBar.Bar();
  var object = {};
  oStickyBar.on('ready', function() {
    // Various initializers, mostly for testing.
    for (var i = 0; i < 5; i++) {
      oStickyBar.buildSticker();
    }
  });
};

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
UI.World.COMMUNICATOR = {};
_.extend(UI.World.COMMUNICATOR, Backbone.Events);

$.extend(UI.World.prototype, {
  
});
