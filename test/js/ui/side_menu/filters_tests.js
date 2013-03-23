'use strict';

module('Cotton.UI.SideMenu.Filters', {

});
var MockDispacher = Class.extend({
  init : function() {},
  publish : function() {},
  suscribe : function() {}
});
test('init.', function() {
  var oDispacher = new MockDispacher();
  var oFilters = new Cotton.UI.SideMenu.Filters(oDispacher);
  ok(oFilters);
});
