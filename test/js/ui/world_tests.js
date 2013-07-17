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

var MockMessenger = Class.extend({
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
  var oApplication = new MockApplication();
  var oMessenger = new MockMessenger();
  var oWorld = new Cotton.UI.World(oApplication, oMessenger);
  ok(oWorld);
});
