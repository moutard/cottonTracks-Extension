var dataTest = [
                {
                  'sUrl': "https://www.github.com",
                  'fLastVisitTime': 1360338084196.688,
                  'fRelevance': null,
                  'id': 1,
                  'lTags': [],
                  'lHistoryItemsId': [1141],
                  'sFeaturedImage': "",
                  'sFormatVersion': "0.1",
                  'sTitle': "My Reviews | git.corp Code Review",
                },
                {
                  'sUrl': "http://www.ltutech.com/",
                  'fLastVisitTime': 1360331471984.9082,
                  'fRelevance': null,
                  'lTags': [],
                  'lHistoryItemsId': [1141],
                  'sFeaturedImage': "",
                  'sFormatVersion': "0.1",
                  'sTitle': "LTU",
                },
                {
                  'sUrl': "http://docs.ltutech.com/",
                  'fLastVisitTime': 1360329780640.9968,
                  'fRelevance': null,
                  'lTags': [],
                  'lHistoryItemsId': [1141],
                  'sFeaturedImage': "",
                  'sFormatVersion': "0.1",
                  'sTitle': "Add New Promotion ‹ LTU — WordPress",
                },
                {
                  'sUrl': "http://www.spclarke.com/wp-content/uploads/2011/11/platters-singing.jpg",
                  'fLastVisitTime': 1359718583764.991,
                  'fRelevance': null,
                  'lTags': [],
                  'lHistoryItemsId': [1141],
                  'sFeaturedImage': "http://www.spclarke.com/wp-content/uploads/2011/11/platters-singing.jpg",
                  'sFormatVersion': "0.1",
                  'sTitle': "bogart",
                }
];

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
  var dHistoryItem = oSingleCache.get();
  delete dHistoryItem['sExpiracyDate'];
  deepEqual(oSingleCache.get(), [dataTest[0]]);
});

test("putUnique", function() {
  var mMerge = function(dItem1, dItem2) {
    dItem1['fLastVisitTime'] = Math.max(dItem1['fLastVisitTime'], dItem2['fLastVisitTime']);
    return dItem1;
  };
  oSingleCache = new Cotton.DB.SingleStoreCache('test-single-cache');
  oSingleCache.putUnique(dataTest[0], 'sUrl', mMerge);
  oSingleCache.putUnique(dataTest[0], 'sUrl', mMerge);
  oSingleCache.putUnique(dataTest[1], 'sUrl', mMerge);
  var dHistoryItem = oSingleCache.get();
  delete dHistoryItem['sExpiracyDate'];
  deepEqual(oSingleCache.get(), [dataTest[0], dataTest[1]]);
});

test("getFresh updates the store with expiracy 0.", function() {
  // Make a cache where everyhting expires immediately.
  oSingleCache = new Cotton.DB.SingleStoreCache('test-cache', 0);
  oSingleCache.put(dataTest[0]);
  deepEqual(oSingleCache.getFresh(), []);
  // As we just called getFresh the stores have been updated.
  deepEqual(oSingleCache.get(), []);
});

test("_refresh.", function() {
  // Make a cache where everyhting expires immediately.
  oSingleCache = new Cotton.DB.SingleStoreCache('test-cache', 0);
  oSingleCache._refresh(dataTest);
  deepEqual(oSingleCache.get(), dataTest);
});

test("_refresh with getFresh", function() {
  // Make a cache where everyhting expires immediately.
  oSingleCache = new Cotton.DB.SingleStoreCache('test-cache', 0);
  oSingleCache._refresh(dataTest);
  // As you insert elements with no expiracy date, get fresh will remove them.
  deepEqual(oSingleCache.getFresh(), []);
});

test("_refresh with no arguments", function() {
  // Make a cache where everyhting expires immediately.
  oSingleCache = new Cotton.DB.SingleStoreCache('test-cache', 0);
  oSingleCache.put(dataTest[0]);
  oSingleCache.put(dataTest[1]);
  oSingleCache._refresh();
  // As you insert elements with no expiracy date, get fresh will remove them.
  deepEqual(oSingleCache.getFresh(), []);
});

