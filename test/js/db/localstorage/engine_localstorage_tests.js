var oEngine;

module("Cotton.DB.LocalStorage.Engine",{
  setup: function() {
    // runs before each test
    oEngine = new Cotton.DB.LocalStorage.Engine('test', {
    "stories": {
      "fLastVisitTime": {
        "unique": false
      },
      "id": {
        "unique": true
      },
      "lTags": {
        "multiEntry": true,
        "unique": false
      }
    },
    "visitItems": {}
  });

  },
  teardown: function() {
    // runs after each test
    oEngine.purge();
  }
});

test("init", function() {
   ok(oEngine);
});


