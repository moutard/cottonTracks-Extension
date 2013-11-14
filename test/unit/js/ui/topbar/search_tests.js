'use strict';

module('Cotton.UI.Topbar.Search', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oSearchBar = new Cotton.UI.Topbar.Search(oDispatcher);
  ok(oSearchBar);
});