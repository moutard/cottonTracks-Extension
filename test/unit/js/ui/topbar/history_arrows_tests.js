'use strict';

module('Cotton.UI.Topbar.HistoryArrows', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oHistoryArrows = new Cotton.UI.Topbar.HistoryArrows(oDispatcher);
  ok(oHistoryArrows);
});