'use strict';
var dAliceBag = {
 'wonderland': 5,
 'alice': 2,
 'lewis': 3,
 'caroll': 6,
 'cat': 1,
 'hatter' :1,
 'twinkle':2
};

module("Cotton.DB.Model.BagOfWords",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("init.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords();
  ok(oBagOfWords);
});

test("bagOfWords with dictionnary.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({
    'wonderland': 5,
    'alice': 2,
  });
  ok(oBagOfWords);
  deepEqual(oBagOfWords.get(), {
    'wonderland': 5,
    'alice': 2,
  });
});

test("bagOfWords preponderant.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords(dAliceBag);
  deepEqual(oBagOfWords.preponderant(),
    ['caroll', 'wonderland']);
});

test("bagOfWords capital letters.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({
    'wonderland': 5,
    'Alice': 2,
  });
  ok(oBagOfWords);
  deepEqual(oBagOfWords.get(), {
    'wonderland': 5,
    'alice': 2,
  });
});

test("bagOfWords size.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords(dAliceBag);
  deepEqual(oBagOfWords.size(),7);
});


