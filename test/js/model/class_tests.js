'use strict';
var L = [6,7,8];

module("Cotton.Model.Class",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

var ClassTest = Class.extend({
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
  },
  reject : function(i){
    this._array = _.reject(this._array, function(a){ return a===i;});
  },
});

test("init.", function() {
  var oClass = new ClassTest();
  equal(oClass.array(), oClass._array);
  equal(oClass.int(), oClass._int);

});

test("setArray.", function() {
  var oClass = new ClassTest();
  oClass.setArray([1,2,3]);
  deepEqual(oClass.array(), [1,2,3]);
  equal(oClass.int(), oClass._int);

});

test("addInArray.", function() {
  var oClass = new ClassTest();
  deepEqual(oClass.array(), []);
  for(var i = 0, iLength = L.length; i < iLength; i++){
    oClass.addInArray(L[i]);
  };
  deepEqual(oClass.array(), [6,7,8]);

  oClass = new ClassTest();
  deepEqual(oClass.array(), []);

  var oClass2 = new ClassTest();
  deepEqual(oClass2.array(), []);

});


test("_array IS A STATIC variable shared by all the class if not reinitialized, in the init function.", function() {
  var oClass = new ClassTest();
  oClass.setArray([1,2,3]);
  deepEqual(oClass.array(), [1,2,3]);

  var oClass = new ClassTest();
  deepEqual(oClass.array(), [1,2,3]);
  deepEqual(oClass._array, [1,2,3]);

  // BECAREFUL !!! WE WOULD EXPECT AN EMPTY ARRAY.
  var oClass2 = new ClassTest();
  deepEqual(oClass2.array(), [1,2,3]);
  deepEqual(oClass2._array, [1,2,3]);

});
