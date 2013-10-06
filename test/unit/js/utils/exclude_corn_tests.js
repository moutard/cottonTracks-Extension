module("Cotton.Utils.ExcludeCorn",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("CornHash.", function() {

  deepEqual(Cotton.Utils.CornHash("abc"), "bcd");
  deepEqual(Cotton.Utils.CornHash("xyz"), "yz{");
  deepEqual(Cotton.Utils.CornHash("|}"), "}~");
});

test("CornUnHash.", function() {

  deepEqual(Cotton.Utils.CornUnHash("abc"), "`ab");
  deepEqual(Cotton.Utils.CornUnHash("xyz"), "wxy");
  deepEqual(Cotton.Utils.CornUnHash("|}"), "{|");
});

test("CornHashAllKeywords.", function() {
  var lKeywords = ["porn", "sex", "blowjob"];
  var lHostname = ["youporn.com"];
  var lHashKeywords = [];
  for (var i = 0, iLength = lKeywords.length; i < iLength; i++) {
    lHashKeywords.push(Cotton.Utils.CornHash(lKeywords[i]));
  }

  for (var i = 0, iLength = lKeywords.length; i < iLength; i++) {
    deepEqual(Cotton.Utils.CornUnHash(lHashKeywords[i]), lKeywords[i]);
  }

  console.log(lHashKeywords);
});

test("isCorn.", function() {
  var oCornExcluder = new Cotton.Utils.CornExcluder();
  equal(oCornExcluder.isCorn("http://www.youporn.com/channels/"), true);
  equal(oCornExcluder.isCorn("http://www.pornhub.com/channels/"), true);
  equal(oCornExcluder.isCorn("http://www.sexalive.com/channels/"), true);
});
