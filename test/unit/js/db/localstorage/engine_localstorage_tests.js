'use strict';

module("Cotton.DB.LocalStorage.Engine",{
  setup: function() {
    // runs before each test
    },
  teardown: function() {
    // runs after each test
  }
});

test("init one store no index.", function() {
   var oEngine1 = new Cotton.DB.LocalStorage.Engine('test-noindex', {
    "historyItems": {}
  });

   ok(oEngine1);
   oEngine1.purge();
});

test("init one store 2 indexes.", function() {
   var oEngine2 = new Cotton.DB.LocalStorage.Engine('test-noindex', {
    "stories": {
      "fLastVisitTime": {
        "unique": false
      },
      "id": {
        "unique": true
      },
    }
  });

   ok(oEngine2);
   oEngine2.purge();
});

test("_getStoreLocation.", function() {
   var oEngine2 = new Cotton.DB.LocalStorage.Engine('test-noindex', {
    "stories": {
      "fLastVisitTime": {
        "unique": false
      },
      "id": {
        "unique": true
      },
    }
  });

   equal(oEngine2._getStoreLocation('stories'), 'test-noindex-stories');
   oEngine2.purge();

});

test("get and put.", function() {
  expect(3);
   var oEngine3 = new Cotton.DB.LocalStorage.Engine('test-noindex', {
    "stories": {
      "fLastVisitTime": {
        "unique": false
      },
      "id": {
        "unique": true
      },
    }
  });
   var dItem = {'id':3, 'title': 'Alice in wonderland'};
   deepEqual(oEngine3.getList('stories'), []);
   oEngine3.put('stories', dItem);
   deepEqual(oEngine3.getList('stories'), [dItem]);
   oEngine3.purge();
   throws(function(){
     oEngine3.getList('stories');
   }, "store should not exist.");

});

test("throws error on non existing store.", function() {
   var oEngine3 = new Cotton.DB.LocalStorage.Engine('test-noindex', {
    "stories": {
      "fLastVisitTime": {
        "unique": false
      },
      "id": {
        "unique": true
      },
    }
  });
  throws(function(){
    oEngine3.getList('historyItems');
  },  "store should not exist.")

});
