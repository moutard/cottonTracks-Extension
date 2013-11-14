module("Cotton.Integration.DB",{
  setup:function() {
    // runs before each test
  },
teardown:function() {
    // runs after each test
  }
});

/**
 * PutList -
 * Check that put an empty list return the callback function.
 */
asyncTest("putList - an empty list return callback.", function() {
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var oDatabase = oIntegrationBackground.database();
  oDatabase.putList('searchKeywords', [], function(id) {
    ok("the callback is called.");
    start();
  });
});

/**
 * Empty -
 * Check that the empty method of the database works.
 */
asyncTest("empty works fine.", function() {
  var oDatabase = oIntegrationBackground.database();
  var oKeyword = new Cotton.Model.SearchKeyword("alice");
  oDatabase.put('searchKeywords', oKeyword, function(id2) {
    oDatabase.empty('searchKeywords', function(id) {
      equal(false, id);
      oDatabase.empty('stories', function(id) {
        equal(true, id);
        start();
      });
    });
  });
});

/**
 * Put - Same "id" different "sUrl".
 *
 * Explanation:
 * - sUrl has unique index
 * - id has unique index and auto increment
 *
 *   "id" already exists so there is a constraint error, but the database can
 *   resolve this conflict finding the only one corresponding entry (this
 *   resolution is possible because only the id is the same, and the new url
 *   doesn't exist). So the "put" method can replace the old entry by the new
 *   one.
 *
 *   No error.
 *   Replace by new entry.
 */
asyncTest("put - same id different sUrl.", function() {
  console.debug("Test: put - same id different sUrl.");
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sOldUrl = 'http://ct-test.com/put-same_id_different_url_old';
  var sNewUrl = 'http://ct-test.com/put-same_id_different_url_new';

  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sOldUrl
  });
  oDatabase.put('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'id': _iOldId,
      'sUrl': sNewUrl
    });

    oDatabase.put('historyItems', oHistoryItem2, function(id2) {
      // Put has replace the old record by the new one.
      // use "find_w" that is readwrite to be sure that the update is done.
      oDatabase.find_w('historyItems', 'id', id2, function(oHistoryItem) {
        deepEqual(oHistoryItem.url(), sNewUrl, "put method replace if no constraint error.");
        start();
      });
    });
  });
});

/**
 * Add - Same "id" different "sUrl".
 *
 * Explanation:
 * - sUrl has unique index
 * - id has unique index and auto increment
 *
 *   "id" already exists but even if the database can resolve this conflict
 *   like in the previous test, "add" method is not allowed to replace
 *   the old entry by the new one. So the error is thrown.
 *
 *   Error.
 *   Key the old entry.
 */
asyncTest("add - same id different sUrl.", function() {
  console.debug("Test: add - same id different sUrl.");
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sOldUrl = 'http://ct-test.com/add-same_id_different_url_old';
  var sNewUrl = 'http://ct-test.com/add-same_id_different_url_new';

  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sOldUrl
  });
  oDatabase.add('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'id': _iOldId,
      'sUrl': sNewUrl
    });

    oDatabase.add('historyItems', oHistoryItem2, function(dResult) {
      // Put has replace the old record by the new one.
      deepEqual(dResult.error,
        "DB.Engine.Add - ConstraintError: Key already exists in the object store.",
        "add method do not replace if constraint error.");
      start();
    });
  });
});

/**
 * Put - "id" not set and same "sUrl"
 *
 * Explanation:
 * - sUrl has unique index
 * - id has unique index and auto increment
 *
 *   as "id" is not set the database will try to increment it so if the last
 *   "id" is let say 10, the "id" will be 11 before it tries to be put in the
 *   database.
 *
 *   Here the "sUrl" already exists, so there is a constraint error, but in
 *   this specific case because "id" is set to a different value, the database
 *   can not resolve the conflict.
 *
 *   Error.
 *   Keep the old entry.
 *
 */
asyncTest("put - id not set and same sUrl.", function() {
  console.debug("Test: put - id not set and same sUrl.");
  // Just to be sure that it's the last things display in the console,
  // so it's more easy to debug.
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/put-same_url_id_not_set";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
  });
  oDatabase.put('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sUrl': sTestUrl,
      'iVisitCount': 3,
    });

    oDatabase.put('historyItems', oHistoryItem2, function(dResult) {
      deepEqual(dResult.error,
        "DB.Engine.Put - ConstraintError: Unable to add key to index 'sUrl': at least one key does not satisfy the uniqueness requirements.");
      start();
    });
  });
});

/**
 * Add - "id" not set and same "sUrl"
 *
 * Explanation:
 * - sUrl has unique index
 * - id has unique index and auto increment
 *
 *   See "Put" - test
 *   The database can not resolve the conflict, so an error is thrown.
 *   Here "add" works exactly like "put"
 *
 *   Error.
 *   Keep the old entry.
 */
asyncTest("add - id not set and same sUrl.", function() {
  console.debug("Test: add - id not set and same sUrl.");
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/add-same_url_id_not_set";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 1,
  });
  oDatabase.add('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sUrl': sTestUrl,
      'iVisitCount': 2,
    });

    oDatabase.add('historyItems', oHistoryItem2, function(dResult) {
      deepEqual(dResult.error,
        "DB.Engine.Add - ConstraintError: Unable to add key to index 'sUrl': at least one key does not satisfy the uniqueness requirements.");
      start();
    });

  });
});

/**
 * Put - Same "id" and same "sUrl"
 *
 * Explanation:
 * - sUrl has unique index
 * - id has unique index and auto increment
 *
 *   "id" is set so the database do not try to increment it.
 *   "id" already exists the database,
 *   "sUrl" also exists.
 *   but as "id" and "sUrl" exists and correspond to the same entry, the
 *   database can resolve the conflict (there is only one entry that match
 *   both constraints error).
 *
 *   So the database find the exact entry that matches all the indexes
 *   uniquiness constraint. And the "put" can simply replace the old entry by
 *   the new and no need to throw an error.
 *
 *   No Error.
 *   Replace the old entry by the new one.
 */
asyncTest("put - same id and same sUrl.", function() {
  console.debug("Test: put - same id and same sUrl.");
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/put-same_url_and_same_id";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 1,
  });
  oDatabase.put('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'id': id1,
      'sUrl': sTestUrl,
      'iVisitCount': 2,
    });

    oDatabase.put('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      // use "find_w" that is readwrite to be sure that the update is done.
      oDatabase.find_w('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        // Put has replace the old record by the new one.
        deepEqual(oHistoryItem.visitCount(), 2, "only the last visit count is saved.");
        deepEqual(_iOldId, _iNewId, "put replace the same");
        start();
      });
    });
  });
});

/**
 * Add - Same "id" and same "sUrl"
 *
 * Explanation:
 * - sUrl has unique index
 * - id has unique index and auto increment
 *
 *   See "Put - Same "sUrl" and same "id"",
 *   Even if the database can resolve the conflict, "add" method is not
 *   allowed to replace the entry, so an error is thrown.
 *
 *   Here "add" do not works like "put"
 *
 *   Error.
 *   Keep the old entry.
 */
asyncTest("add - same id and same sUrl.", function() {
  console.debug("Test: add - same id and same sUrl.");
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/add-same_url_and_same_id";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'iVisitCount': 4,
  });
  oDatabase.add('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': id1,
      'sUrl': sTestUrl,
      'iVisitCount': 3,
    });

    oDatabase.add('historyItems', oHistoryItem2, function(dResult) {
      deepEqual(dResult.error,
        "DB.Engine.Add - ConstraintError: Unable to add key to index 'sUrl': at least one key does not satisfy the uniqueness requirements.");
      start();
    });
  });
});

/******************************************************************************
 * PUT_UNIQUE
 *****************************************************************************/

/**
 * putUnique -
 * id(B) == id(A) and url(B) == url(A)
 *
 * "add" can resolve the conflict, but not allowed to. So constraint error is
 * solved by the merge function and then "put" method is allowed to replace
 * the old entry.
 * -> success and overwrite
 *
 */
asyncTest("putUnique - id(B) == id(A) and url(B) == url(A).", function() {
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_equal_and_url_equal";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'oExtractedDNA': {
      'oBagOfWords': {
        'first': 1,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sId': id1,
      'sUrl': sTestUrl,
      'oExtractedDNA': {
        'oBagOfWords': {
          'second': 2
        }
      }
    });

    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find_w('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        // Check that the merged function has been called.
        deepEqual(oHistoryItem.extractedDNA().bagOfWords().get(), {
          'first': 1,
          'second': 2
        });
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});

/**
 * putUnique -
 * id(B) not set and url(B) == url(A)
 *
 * The database can't solve the conflict.
 * -> success and overwrite
 */
asyncTest("putUnique - if id(B) is not set and url(B) == url(A).", function() {
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_not_equal_and_url_equal";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'oExtractedDNA': {
      'oBagOfWords': {
        'first': 1,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sUrl': sTestUrl,
      'oExtractedDNA': {
        'oBagOfWords': {
          'second': 2
        }
      }
    });

    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find_w('historyItems', 'sUrl', sTestUrl, function(oHistoryItem) {
        deepEqual(oHistoryItem.extractedDNA().bagOfWords().get(), {
          'first': 1,
          'second': 2
        }, "not correctly merged");
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});

/**
 * putUnique -
 * id(B) == id(A) and url(B) =! url(A)
 *
 * The database can't solve the conflict.
 * But even the merge function should not be able to solve this conflict,
 * it could corrupt database data.
 *
 * Merge conflict error.
 * -> expect an error, we can not take the risk that the url was reset.
 */
asyncTest("putUnique if id(B) == id(A) and url(B) != url(A).", function() {
  console.log("Test: putUnique id(B) == id(A) and url(B) != url(A).");
  var _iOldId, _iNewId;
  var sTestUrl = "http://ct-test.com/id_equal_and_url_not_equal";
  var oDatabase = oIntegrationBackground.database();
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
    'sUrl': sTestUrl,
    'oExtractedDNA': {
      'oBagOfWords': {
        'first': 1,
      }
    }
  });
  oDatabase.putUnique('historyItems', oHistoryItem1, function(id1) {
    _iOldId = id1;
    var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'id': id1,
      'sUrl': "http://ct-test.com/try_to_corrupt_the_database",
      'oExtractedDNA': {
        'oBagOfWords': {
          'second': 2
        }
      }
    });

    oDatabase.putUnique('historyItems', oHistoryItem2, function(id2) {
      _iNewId = id2;
      oDatabase.find_w('historyItems', 'id', id2, function(oHistoryItem) {
        // Merge function has return the old one.
        deepEqual(oHistoryItem.extractedDNA().bagOfWords().get(), {
          'first': 1,
        }, "not correctly merged");
        deepEqual(_iOldId, _iNewId);
        start();
      });
    });
  });
});
