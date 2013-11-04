'use strict';

module('Cotton.UI.Settings.UISettings', {

});

test('init.', function() {
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oUISettings = new Cotton.UI.Settings.UISettings(oDispatcher);
  ok(oUISettings);
});