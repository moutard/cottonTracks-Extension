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

test("init with no bag of words.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords();
  ok(oBagOfWords);
});

test("init bag of words with dictionnary lowercase.", function() {
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

test("init bag of words with dictionnary uppercase.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5});
  // All words should be lower case in the bag of words.
  deepEqual(oBagOfWords._dBag, {"alice": 5});
});

test("setBag.", function() {
  // modified here because we keep the biggest score.
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5});
  oBagOfWords.setBag({"Wonderland": 9});
  deepEqual(oBagOfWords._dBag, {"wonderland": 9});
});

test("add a new word.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords();
  oBagOfWords.addWord("Alice", 5);
  oBagOfWords.addWord("Wonderland", 6);
  deepEqual(oBagOfWords._dBag, {"alice": 5, "wonderland": 6});
});

test("add an exisiting words.", function() {
  // Not modified because we only keep the biggest score.
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5});
  oBagOfWords.addWord("Alice", 3);
  deepEqual(oBagOfWords._dBag, {"alice": 5});
});

test("add an exisiting words.", function() {
  // modified here because we keep the biggest score.
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5});
  oBagOfWords.addWord("Alice", 9);
  deepEqual(oBagOfWords._dBag, {"alice": 9});
});

test("simple mergeBag.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5});
  oBagOfWords.mergeBag({"Wonderland": 9});
  deepEqual(oBagOfWords._dBag, {"wonderland": 9, "alice": 5});
});

test("complexe mergeBag.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5, "Rabbit": 2});
  oBagOfWords.mergeBag({"Wonderland": 9, "rabbit": 5});
  deepEqual(oBagOfWords._dBag, {"wonderland": 9, "alice": 5, "rabbit": 5});
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

test("increaseWordScore of an existing word.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5});
  oBagOfWords.increaseWordScore("Alice", 0);
  oBagOfWords.increaseWordScore("Alice", 3);
  deepEqual(oBagOfWords._dBag, {"alice": 8});
});

test("increaseWordScore of an NON existing word.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({"Alice": 5});
  oBagOfWords.increaseWordScore("Wonderland", 5);
  deepEqual(oBagOfWords._dBag, {"alice": 5, "wonderland": 5});
});

test("maxWeight.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({
    'wonderland': 5,
    'alice': 2,
  });
  equal(oBagOfWords.maxWeight(), 5);

});

test("getWords.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({
    'wonderland': 5,
    'alice': 2,
  });
  // The order is important in deepEqual.
  deepEqual(oBagOfWords.getWords(), ["wonderland", "alice"]);

});

test("enough preponderant.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({
    'wonderland': 5,
    'alice': 4,
    'white': 3,
    'cat': 2,
    'rabbit':1
  });
  deepEqual(oBagOfWords.preponderant(1), ["wonderland"]);
  deepEqual(oBagOfWords.preponderant(2), ["wonderland", "alice"]);
  deepEqual(oBagOfWords.preponderant(3), ["wonderland", "alice", "white"]);
  deepEqual(oBagOfWords.preponderant(4), ["wonderland", "alice", "white", "cat"]);
  deepEqual(oBagOfWords.preponderant(5), ["wonderland", "alice", "white", "cat", "rabbit"]);

});

test("NOT enough preponderant.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({
    'wonderland': 5,
    'alice': 4,
    'white': 3,
    'cat': 2,
    'rabbit':1
  });
  deepEqual(oBagOfWords.preponderant(9), ["wonderland", "alice", "white", "cat", "rabbit"]);

});

test("equal score preponderant.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords({
    'wonderland': 5,
    'alice': 5,
    'white': 5,
    'cat': 5,
    'rabbit':1
  });
  deepEqual(oBagOfWords.preponderant(3), ["wonderland", "alice", "white"]);

});

test("preponderant iNumberOfPreponderant by default.", function() {
  var oBagOfWords = new Cotton.Model.BagOfWords(dAliceBag);
  deepEqual(oBagOfWords.preponderant(),
    ['caroll', 'wonderland']);
});
