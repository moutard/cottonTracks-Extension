'use strict';
module(
    "Cotton.Algo.Tools",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


test("Cotton.Algo.Tools.extractWords - Empty title. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWords(""), []);
});

test("Cotton.Algo.Tools.extractWords - Jennifer Anniston title. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWords("Jennifer Anniston"),
    ['jennifer', 'anniston']);
});

test("Cotton.Algo.Tools.extractWords - less than 2 letters words. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWords("ou est donc or ni car ?"),
    ['est', 'donc', 'car']);
});

test("Cotton.Algo.Tools.extractWords - less than 2 letters words. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWords("ou est donc or ni car."),
    ['est', 'donc', 'car']);
});

test("Cotton.Algo.Tools.extractWordsUrl - less than 2 letters words. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsUrl("http://what_are_the_words_in_this_url.com"),
    ['what', 'are', 'the', 'words', 'this', 'url']);
});

