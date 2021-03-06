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

test("Filter.", function() {
  var lWords = ["wikipedia", "js", "e34dede", "wikipédia"];
  deepEqual(Cotton.Algo.Tools.LooseFilter(lWords), ["wikipedia", "e34dede", "wikipédia"]);
});

test("TightFilter.", function() {
  var lWords = ["wikipedia", "js", "e34dede", "wikipédia"];
  deepEqual(Cotton.Algo.Tools.TightFilter(lWords), ["wikipedia", "wikipédia"]);
});

test("StrongQueryWords.", function() {
  var lWords = ["wikipedia", "js", "e34dede", "wikipédia"];
  var dQueryWords = Cotton.Algo.Tools.QueryWords(lWords);
  deepEqual(dQueryWords["strong"], ["wikipedia", "e34dede", "wikipédia"]);
});

test("WeakQueryWords.", function() {
  var lWords = ["wikipedia", "js", "e34dede", "wikipédia"];
  var dQueryWords = Cotton.Algo.Tools.QueryWords(lWords);
  deepEqual(dQueryWords["weak"], ["js"]);
});

test("extractWordsFromTitle.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle(" "), []);
});

test("extract words on empty title.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle(""), []);
});

test("extract words on Jennifer Anniston title.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("Jennifer Anniston"),
    ['Jennifer', 'Anniston']);
});

test("extract words on less than 2 letters words.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("ou est donc or ni car ?"),
    ['ou', 'est', 'donc', 'or', 'ni', 'car']);
});

test("extract words on less than 2 letters words with punctuation.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("ou est donc or ni car."),
    ['ou', 'est', 'donc', 'or', 'ni', 'car']);
});

test("extract words with duplicate.", function() {
  deepEqual(Cotton.Algo.Tools.extractWordsFromTitle("Javascript - the best of javascript tuto."),
    ['Javascript', 'the', 'best', 'of', 'javascript', 'tuto']);
});

test("extractCleanWordsFromTitle.", function() {
  deepEqual(Cotton.Algo.Tools.extractCleanWordsFromTitle(" "), []);
});

test("extract clean words on empty title.", function() {
  deepEqual(Cotton.Algo.Tools.extractCleanWordsFromTitle(""), []);
});

test("extract clean words on Jennifer Anniston title.", function() {
  deepEqual(Cotton.Algo.Tools.extractCleanWordsFromTitle("Jennifer Anniston"),
    ['jennifer', 'anniston']);
});

test("extract clean words on less than 2 letters words. ", function() {
  deepEqual(Cotton.Algo.Tools.extractCleanWordsFromTitle("ou est donc or ni car ?"),
    ['est', 'donc', 'car']);
});

test("extract clean words on less than 2 letters words with punctuation.", function() {
  deepEqual(Cotton.Algo.Tools.extractCleanWordsFromTitle("ou est donc or ni car."),
    ['est', 'donc', 'car']);
});

test("extract clean words with duplicate.", function() {
  deepEqual(Cotton.Algo.Tools.extractCleanWordsFromTitle("Javascript - the best of javascript tuto."),
    ['javascript', 'best', 'javascript', 'tuto']);
});

test("extract words from url. ", function() {
  var sUrl = "http://example.com/what_are_the_words_in_this_url";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['words', 'this', 'url']);


  var sUrl = "http://techcrunch.com/2013/02/19/yota-to-mass-produce-e-ink-phone-in-singapore/";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['yota', 'mass', 'produce', 'ink', 'phone', 'singapore']);

});


