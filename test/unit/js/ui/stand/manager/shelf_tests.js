'use strict';

module('Cotton.UI.Stand.Manager.Shelf', {

});

test('init.', function() {
  var dArguments = {'title': "mock shelf"};
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oShelf = new Cotton.UI.Stand.Manager.Shelf(dArguments, oDispatcher);
  ok(oShelf);
});