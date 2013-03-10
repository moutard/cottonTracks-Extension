var dataTest = [
                {
                  fLastVisitTime: 1360338084196.688,
                  fRelevance: null,
                  id: 1,
                  lTags: [],
                  lHistoryItemsId: [1141],
                  sFeaturedImage: "",
                  sFormatVersion: "0.1",
                  sTitle: "My Reviews | git.corp Code Review",
                },
                {
                  fLastVisitTime: 1360331471984.9082,
                  fRelevance: null,
                  lTags: [],
                  lHistoryItemsId: [1141],
                  sFeaturedImage: "",
                  sFormatVersion: "0.1",
                  sTitle: "LTU",
                },
                {
                  fLastVisitTime: 1360329780640.9968,
                  fRelevance: null,
                  lTags: [],
                  lHistoryItemsId: [1141],
                  sFeaturedImage: "",
                  sFormatVersion: "0.1",
                  sTitle: "Add New Promotion ‹ LTU — WordPress",
                },
                {
                  fLastVisitTime: 1359718583764.991,
                  fRelevance: null,
                  lTags: [],
                  lHistoryItemsId: [1141],
                  sFeaturedImage: "http://www.spclarke.com/wp-content/uploads/2011/11/platters-singing.jpg",
                  sFormatVersion: "0.1",
                  sTitle: "bogart",
                }
];

var oCache;

module("Cotton.DB.Cache",{
  setup: function() {
    // runs before each test
    // Reinitialise localStorage.
    oCache = new Cotton.DB.Cache('test-cache', {'historyItems':{}});
    oCache.purge();
  },
  teardown: function() {
    // runs after each test
    oCache.purge();
  }
});

test("init.", function() {
  oCache = new Cotton.DB.Cache('test-cache', {'historyItems':{}});
  ok(oCache);
});

test("get empty cache.", function() {
  oCache = new Cotton.DB.Cache('test-cache', {'historyItems':{}});
  deepEqual(oCache.getStore('historyItems'), []);
});

test("put.", function() {
  oCache = new Cotton.DB.Cache('test-cache',{'historyItems':{}}, 5000);
  oCache.put('historyItems', dataTest[0]);
  var dHistoryItem = oCache.getStore('historyItems');
  delete dHistoryItem['sExpiracyDate'];
  deepEqual(oCache.getStore('historyItems'), [dataTest[0]]);
});

test("getFresh with expiracy 0.", function() {
  // Make a cache where everyhting expires immediately.
  oCache = new Cotton.DB.Cache('test-cache',{'historyItems':{}}, 0);
  oCache.put('historyItems', dataTest[0]);
  deepEqual(oCache.getFresh('historyItems'), []);
});

test("getFresh updates the store with expiracy 0.", function() {
  // Make a cache where everyhting expires immediately.
  oCache = new Cotton.DB.Cache('test-cache',{'historyItems':{}}, 0);
  oCache.put('historyItems', dataTest[0]);
  deepEqual(oCache.getFresh('historyItems'), []);
  // As we just called getFresh the stores have been updated.
  deepEqual(oCache.getStore('historyItems'), []);
});

test("_refresh.", function() {
  // Make a cache where everyhting expires immediately.
  oCache = new Cotton.DB.Cache('test-cache',{'historyItems':{}}, 0);
  oCache._refresh('historyItems', dataTest);
  deepEqual(oCache.getStore('historyItems'), dataTest);
});

test("_refresh with getFresh", function() {
  // Make a cache where everyhting expires immediately.
  oCache = new Cotton.DB.Cache('test-cache',{'historyItems':{}}, 0);
  oCache._refresh('historyItems', dataTest);
  // As you insert elements with no expiracy date, get fresh will remove them.
  deepEqual(oCache.getFresh('historyItems'), []);
});

test("_refresh with no arguments", function() {
  // Make a cache where everyhting expires immediately.
  oCache = new Cotton.DB.Cache('test-cache',{'historyItems':{}}, 0);
  oCache.put('historyItems', dataTest[0]);
  oCache.put('historyItems', dataTest[1]);
  oCache._refresh('historyItems');
  // As you insert elements with no expiracy date, get fresh will remove them.
  deepEqual(oCache.getFresh('historyItems'), []);
});

asyncTest("getFresh with expiracy 2.", function() {
  // Make a cache where everyhting expires after 5000 milliseconds.
  oCache = new Cotton.DB.Cache('test-cache',{'historyItems':{}}, 2000);
  oCache.put('historyItems', dataTest[0]);
  setTimeout(function() {
    deepEqual(oCache.getFresh('historyItems'), []);
    start();
  }, 3000);
});
