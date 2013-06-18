'use strict';

module('Cotton.UI.SideMenu.Filters', {

});
var MockDispatcher = Class.extend({
  init : function() {},
  publish : function() {},
  subscribe : function() {}
});
test('init.', function() {
  var oDispatcher = new MockDispatcher();
  var oFilters = new Cotton.UI.SideMenu.Filters(oDispatcher);
  ok(oFilters);
});
