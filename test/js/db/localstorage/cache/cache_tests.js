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

