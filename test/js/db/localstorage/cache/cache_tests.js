var dataTest = [
                {
                  fLastVisitTime: 1360338084196.688,
                  fRelevance: null,
                  id: 1,
                  lTags: [],
                  lVisitItemsId: [1141],
                  sFeaturedImage: "",
                  sFormatVersion: "0.1",
                  sTitle: "My Reviews | git.corp Code Review",
                },
                {
                  fLastVisitTime: 1360331471984.9082,
                  fRelevance: null,
                  lTags: [],
                  lVisitItemsId: [1141],
                  sFeaturedImage: "",
                  sFormatVersion: "0.1",
                  sTitle: "LTU",
                },
                {
                  fLastVisitTime: 1360329780640.9968,
                  fRelevance: null,
                  lTags: [],
                  lVisitItemsId: [1141],
                  sFeaturedImage: "",
                  sFormatVersion: "0.1",
                  sTitle: "Add New Promotion ‹ LTU — WordPress",
                },
                {
                  fLastVisitTime: 1359718583764.991,
                  fRelevance: null,
                  lTags: [],
                  lVisitItemsId: [1141],
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
    oCache = new Cotton.DB.Cache('test-cache', {'visitItems':{}});
    oCache.purge();
  },
  teardown: function() {
    // runs after each test
    oCache.purge();
  }
});

test("init", function() {
  oCache = new Cotton.DB.Cache('test-cache', {'visitItems':{}});
  ok(oCache);
});

test("put", function() {
  oCache = new Cotton.DB.Cache('test-cache',{'visitItems':{}}, 5000);
  oCache.put('visitItems', dataTest[0]);
  var dVisitItem = oCache.getStore('visitItems');
  delete dVisitItem['sExpiracyDate'];
  deepEqual(oCache.getStore('visitItems'), [dataTest[0]]);
});

var oSingleCache;

module("Cotton.DB.SingleStoreCache",{
  setup: function() {
    // runs before each test
    // Reinitialise localStorage.
    oSingleCache = new Cotton.DB.SingleStoreCache('test-single-cache');
    oSingleCache.purge();
  },
  teardown: function() {
    // runs after each test
    oSingleCache.purge();
  }
});

test("init", function() {
  oSingleCache = new Cotton.DB.SingleStoreCache('test-single-cache');
  ok(oSingleCache);
});

test("put", function() {
  oSingleCache = new Cotton.DB.SingleStoreCache('test-single-cache', 5000);
  oSingleCache.put(dataTest[0]);
  var dVisitItem = oSingleCache.get();
  delete dVisitItem['sExpiracyDate'];
  deepEqual(oSingleCache.get(), [dataTest[0]]);
});

var oFixedCache;
module("Cotton.DB.FixedSizeCache",{
  setup: function() {
    // runs before each test
    // Reinitialise localStorage.
    oFixedCache = new Cotton.DB.FixedSizeCache('test-single-cache', 3);
    oFixedCache.purge();
  },
  teardown: function() {
    // runs after each test
    oFixedCache.purge();
  }
});

test("init.", function() {
  oFixedCache = new Cotton.DB.FixedSizeCache('test-single-cache', 3);
  ok(oFixedCache);
});

test("put.", function() {
  oFixedCache = new Cotton.DB.FixedSizeCache('test-single-cache', 3);
  oFixedCache.put(dataTest[0]);
  var dVisitItem = oFixedCache.get();
  delete dVisitItem['sExpiracyDate'];
  deepEqual(oFixedCache.get(), [dataTest[0]]);
});

test("put limit.", function() {
  oFixedCache = new Cotton.DB.FixedSizeCache('test-single-cache', 2);
  oFixedCache.put(dataTest[0]);
  oFixedCache.put(dataTest[1]);
  oFixedCache.put(dataTest[2]);
  deepEqual(oFixedCache.get().length, 2);
});




