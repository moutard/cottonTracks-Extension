'use strict';

module('Cotton.UI.World', {

});

var MockApplication = Class.extend({
  init: function() {

  },

  getStory : function() {
    return new Cotton.Model.Story();
  },
});

var MockCoreMessenger = Class.extend({
  init : function() {

  },

  listen : function(sAction, mCallback){
    mCallback({
      'status': 0
    });
  },

  sendMessage : function(dMessage, mCallback) {
    mCallback({
      'status': 0
    });
  },
});

test('init.', function() {
  var oCoreMessenger = new MockCoreMessenger();
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var $dom = $('<div class="world"></div>');
  var oWorld = new Cotton.UI.World(oCoreMessenger, oDispatcher, $dom);
  ok(oWorld);
});
