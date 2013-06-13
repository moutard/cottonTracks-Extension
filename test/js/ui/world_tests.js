'use strict';

module('Cotton.UI.World', {

});

var MockApplication = Class.extend({
  init: function() {

  },

  getStory : function() {
    return new Cotton.Model.Story({});
  },
});

var MockSender = Class.extend({
  init : function() {

  },

  sendMessage : function(dMessage, mCallback) {
    mCallback({
      'status': 0
    });
  },
});

test('init.', function() {
  var oApplication = new MockApplication();
  var oSender = new MockSender();
  var oDispacher = new Cotton.Messaging.Dispatcher();
  var $dom_world = $("<div></div>");
  var oWorld = new Cotton.UI.World(oApplication, oSender, oDispacher, $dom_world);
  ok(oWorld);
});
