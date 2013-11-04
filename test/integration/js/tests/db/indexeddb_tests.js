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

/**
 * test that the empty method of the database work.
 */
asyncTest("empty works fine.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var oDatabase = oIntegrationBackground.database();
  oDatabase.empty('historyItems', function(id) {
    equal(false, id);
    oDatabase.empty('stories', function(id) {
      equal(true, id);
      start();
    });
  });
});

asyncTest("putUnique - SearchKeywords do not duplicate the element.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _id;
  var oDatabase = oIntegrationBackground.database();
  var oSearchKeyword1 = new Cotton.Model.SearchKeyword('alice');
  oSearchKeyword1.addReferringHistoryItemId(1);
  oSearchKeyword1.addReferringHistoryItemId(2);
  oDatabase.putUnique('searchKeywords', oSearchKeyword1, function(id1) {
    _id = id1;
    var oSearchKeyword2 = new Cotton.Model.SearchKeyword('alice');
    oSearchKeyword2.addReferringHistoryItemId(4);
    oSearchKeyword2.addReferringHistoryItemId(5);
    oSearchKeyword2.addReferringStoryId(9);
    ok( true, "Passed and ready to resume!" );
    oDatabase.putUnique('searchKeywords', oSearchKeyword2, function(id2) {
      oDatabase.find('searchKeywords', 'id', id2, function(oSearchKeyword) {
        console.log(oSearchKeyword);
        deepEqual(oSearchKeyword.referringStoriesId(), [9]);
        deepEqual(oSearchKeyword.referringHistoryItemsId().sort(), ([4,5,1,2]).sort());
        start();
      });
    });
  });
});
/*
asyncTest("putUnique id not set.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_is_not_set";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sUrl': sTestUrl,
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4);
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        });
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});
*/
/**
 * PUT function.
 */
/*
asyncTest("put - same url id not set.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/put-same_url_id_not_set";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.put('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sUrl': sTestUrl,
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.put('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4);
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        });
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});

asyncTest("put - same url and same id.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/put-same_url_and_same_id";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.put('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': id1,
      'sUrl': sTestUrl,
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.put('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4);
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        });
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});
*/
/**
 * ADD
 */
/*
asyncTest("add - same url id not set.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/add-same_url_id_not_set";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.add('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sUrl': sTestUrl,
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.add('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4);
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        });
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});

asyncTest("add - same url and same id.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/add-same_url_and_same_id";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.add('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': id1,
      'sUrl': sTestUrl,
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.add('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4);
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        });
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});
*/
/**
 * PUT_UNIQUE
 */
/*
asyncTest("putUnique id(B) == id(A) and url(B) == url(A).", function() {
  // if id(B) == id(A) and url(B) == url(A) > success and overwrite (we expect error)
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_equal_and_url_equal";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': id1,
      'sUrl': sTestUrl,
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4);
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        });
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});

asyncTest("putUnique if id(B) != id(A) and url(B) == url(A).", function() {
  // if id(B) == id(A) and url(B) == url(A) > success and overwrite (we expect error)
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_not_equal_and_url_equal";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': 74,
      'sUrl': sTestUrl,
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4, "it keeps right one");
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        }, "correctly merged");
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});

asyncTest("putUnique if id(B) == id(A) and url(B) != url(A).", function() {
  // if id(B) == id(A) and url(B) == url(A) > success and overwrite (we expect error)
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_equal_and_url_not_equal";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': id1,
      'sUrl': "http://ct-test.com/what_the_fuck",
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4, "it keeps right one");
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        }, "correctly merged");
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});

asyncTest("putUnique if id(B) != id(A) and url(B) != url(A).", function() {
  // if id(B) == id(A) and url(B) == url(A) > success and overwrite (we expect error)
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_not_equal_and_url_not_equal";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
    'oExtractedDNA': {
      'dBagOfWords': {
        'first': 3,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': 1,
      'sUrl': "http://ct-test.com/what_the_fuck",
      'iVisitCount': 3,
      'oExtractedDNA': {
        'dBagOfWords': {
          'second': 4
        }
      }
    });

    ok( true, "Passed and ready to resume!" );
    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.visitCount(), 4, "it keeps right one");
        deepEqual(oHistoryItem.extractedDNA().bagOfWords(), {
          'first': 3,
          'second': 4
        }, "correctly merged");
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});
*/
