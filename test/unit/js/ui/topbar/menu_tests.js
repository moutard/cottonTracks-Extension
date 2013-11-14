'use strict';

module('Cotton.UI.Topbar.Menu', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oTopbarMenu = new Cotton.UI.Topbar.Menu(oDispatcher);
  ok(oTopbarMenu);
});