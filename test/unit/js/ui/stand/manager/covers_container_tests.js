'use strict';

module('Cotton.UI.Stand.Manager.CoversContainer', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oCoversContainer = new Cotton.UI.Stand.Manager.CoversContainer(oDispatcher);
  ok(oCoversContainer);
});