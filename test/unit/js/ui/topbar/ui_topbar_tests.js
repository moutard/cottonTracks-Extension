'use strict';

module('Cotton.UI.Topbar.UITopbar', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oTopbar = new Cotton.UI.Topbar.UITopbar(oDispatcher);
  ok(oTopbar);
});