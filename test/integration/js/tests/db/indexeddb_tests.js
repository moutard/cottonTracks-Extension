module("Cotton.Integration.DB",{
  setup:function() {
    // runs before each test
  },
teardown:function() {
    // runs after each test
  }
});

test("fake succeed test.", function() {
  equal(1,1);
});

asyncTest("fake succeed asynchronous test.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  setTimeout(function() {
    ok( true, "Passed and ready to resume!" );
    start();
  }, 1000);
});

/**
 * check that the putunique do not duplicate the element.
 */
asyncTest("putUnique do not duplicate the element.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _id;
  var oDatabase = oIntegrationBackground.database();
  var oSearchKeyword = new Cotton.Model.SearchKeyword('avignon');
  oDatabase.putUnique('searchKeywords', oSearchKeyword, function(id1) {
    _id = id1;
    ok( true, "Passed and ready to resume!" );
    oDatabase.putUnique('searchKeywords', oSearchKeyword, function(id2) {
      ok(id2);
      equal( _id, id2);
      start();
    });
  });

});

/**
 * check that put an empty list return the callback function.
 */
asyncTest("putList an empty list return callback.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var oDatabase = oIntegrationBackground.database();
  oDatabase.putList('searchKeywords', [], function(id) {
    ok("the callback is called.");
    start();
  });

});
