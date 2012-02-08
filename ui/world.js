'use strict';

// World class representing the whole interface.
UI.World = function() {
  var oStickyBar = this._ostickyBar = new UI.StickyBar.Bar();
  oStickyBar.on('ready', function() {
    // Various initializers, mostly for testing.
    for (var i = 0; i < 5; i++) {
      oStickyBar.buildSticker();
    }
  });
};

$.extend(UI.World.prototype, {
  
});
