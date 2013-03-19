'use strict';

module("Cotton.UI.Story.Item.Content.Website",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function(){
  var oWebsite = new Cotton.UI.Story.Item.Content.Website("http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland");
  ok(oWebsite);
});

test("init.", function(){
  var oWebsite = new Cotton.UI.Story.Item.Content.Website("http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland");
  equal(oWebsite._$url.text(), 'en.wikipedia.org');
});

