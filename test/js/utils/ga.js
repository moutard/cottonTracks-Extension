module("Cotton.Analytics",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("analytics event tracking test", function() {
  _gaq.push(['_trackEvent', 'compiler', 'test']);
  expect(0);
});