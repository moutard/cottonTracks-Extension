'use strict';
var L = [6,7,8];

module("Cotton.Model.Class.Bad",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

var BadClassTest = Class.extend({
  _int : 0,
  _array : [],
  init : function() {
  },
  int : function() {
    return this._int;
  },
  array : function() {
    return this._array;
  },
  addInArray : function(u) {
    this._array.push(u);
  },
  setArray : function(array) {
    this._array = array;
  }
});

test("setArray complexe.", function() {
  var oClass = new GoodClassTest();
  // Good behavior only in you initialized in the init function.
  oClass.setArray([1,2,3]);
  deepEqual(oClass.array(), [1,2,3]);

  var oClass = new GoodClassTest();
  deepEqual(oClass.array(), []);
  deepEqual(oClass._array, []);

  // Good behavior here the array is reset by init.
  var oClass2 = new GoodClassTest();
  deepEqual(oClass2.array(), []);
  deepEqual(oClass2._array, []);

});

test("_array IS A STATIC variable shared by all the class if not reinitialized, in the init function.", function() {
  var oClass = new BadClassTest();
  deepEqual(oClass.array(), []);
  // Problem appears with addInArray !
  var iLength = L.length;
  for(var i = 0; i < iLength; i++){
    oClass.addInArray(L[i]);
  };
  deepEqual(oClass.array(), [6,7,8]);

  oClass = new BadClassTest();
  // The array variable is not reset if you don't do it in the init.
  // We would have expected an EMPTY ARRAY !
  deepEqual(oClass.array(), [6,7,8]);

  var oClass2 = new BadClassTest();
  // We would have expected an EMPTY ARRAY !
  deepEqual(oClass2.array(), [6,7,8]);

});

module("Cotton.Model.Class.Good",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

var GoodClassTest = Class.extend({
  _int : undefined,
  _array : null,
  init : function() {
    this._int = 0;
    this._array = [];
  },
  int : function() {
    return this._int;
  },
  array : function() {
    return this._array;
  },
  addInArray : function(u) {
    this._array.push(u);
  },
  setArray : function(array) {
    this._array = array;
  }
});

test("init.", function() {
  var oClass = new GoodClassTest();
  equal(oClass.array(), oClass._array);
  equal(oClass.int(), oClass._int);

});

test("setArray.", function() {
  var oClass = new GoodClassTest();
  oClass.setArray([1,2,3]);
  deepEqual(oClass.array(), [1,2,3]);
  equal(oClass.int(), oClass._int);

});

test("setArray complexe.", function() {
  var oClass = new GoodClassTest();
  // Good behavior only in you initialized in the init function.
  oClass.setArray([1,2,3]);
  deepEqual(oClass.array(), [1,2,3]);

  var oClass = new GoodClassTest();
  deepEqual(oClass.array(), []);
  deepEqual(oClass._array, []);

  // Good behavior here the array is reset by init.
  var oClass2 = new GoodClassTest();
  deepEqual(oClass2.array(), []);
  deepEqual(oClass2._array, []);

});

test("_array IS A STATIC variable shared by all the class if not reinitialized, in the init function.", function() {
  var oClass = new GoodClassTest();
  deepEqual(oClass.array(), []);
  var iLength = L.length;
  for(var i = 0; i < iLength; i++){
    oClass.addInArray(L[i]);
  };
  deepEqual(oClass.array(), [6,7,8]);

  oClass = new GoodClassTest();
  // Good behavior here the array is reset by init.
  deepEqual(oClass.array(), []);

  var oClass2 = new GoodClassTest();
  // Good behavior here the array is reset by init.
  deepEqual(oClass2.array(), []);

});
