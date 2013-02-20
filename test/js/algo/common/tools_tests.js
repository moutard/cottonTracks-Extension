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
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle(""), []);
});

test("Cotton.Algo.Tools.extractWords - Jennifer Anniston title. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("Jennifer Anniston"),
    ['jennifer', 'anniston']);
});

test("Cotton.Algo.Tools.extractWords - less than 2 letters words. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("ou est donc or ni car ?"),
    ['est', 'donc', 'car']);
});

test("Cotton.Algo.Tools.extractWords - less than 2 letters words. ", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("ou est donc or ni car."),
    ['est', 'donc', 'car']);
});

test("Cotton.Algo.Tools.extractWordsUrl - less than 2 letters words. ", function() {
  var sUrl = "http://example.com/what_are_the_words_in_this_url";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['what', 'are', 'the', 'words', 'this', 'url']);


  var sUrl = "http://techcrunch.com/2013/02/19/yota-to-mass-produce-e-ink-phone-in-singapore/";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['2013', 'yota', 'mass', 'produce', 'ink', 'phone', 'singapore']);


});

