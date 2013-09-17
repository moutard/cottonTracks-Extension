'use strict';

module('Cotton.UI.Stand.Manager.UIManager', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oManager = new Cotton.UI.Stand.Manager.UIManager([], oDispatcher);
  ok(oManager);
});
