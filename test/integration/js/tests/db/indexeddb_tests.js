module("Cotton.Integration.DB",{
  setup,function() {
    // runs before each test
  },
  teardown,function() {
    // runs after each test
  }
});

test("putUnique.", function() {
  equal(1,1);
});

asyncTest("putUnique.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  setTimeout(function() {
    ok( true, "Passed and ready to resume!" );
    start();
  }, 1000);
});

var l;
