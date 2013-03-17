'use strict';
Cotton.Test.Data.Pretreatment = {};

module(
    "Cotton.Algo.Pretreatment",
    {
      'setup' : function() {
Cotton.Test.Data.Pretreatment.oHistoryItem1 = {
  'sUrl':"http://www.imdb.com/title/tt1014759/",
  'sTitle': "Alice in wonderland (2010)",
  'iLastVisitTime':1361980612982.948,
  'oExtractedDNA' : {
    'lExtractedWords' : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
    'lQueryWords' : ['alice', 'wonderland', 'film', 'telerama'],
  }
};

Cotton.Test.Data.Pretreatment.oHistoryItem2 = {
  'sUrl':"http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
  'sTitle': "Alice in wonderland - Wikipédia",
  'iLastVisitTime':1361980612982.948,

  'oExtractedDNA' : {
    'lExtractedWords' : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll', 'novel'],
    'lQueryWords' : ['alice', 'wonderland', 'novel'],
  }
};

Cotton.Test.Data.Pretreatment.oHistoryItem3 = {
  'sUrl':"https://www.google.com/search?q=alice+in+wonderland&oq=etherpad",
  'sTitle': "EtherPad - Google search",
  'iLastVisitTime':1361980612982.948,

  'oExtractedDNA' : {
    'lExtractedWords' : ['singapor', 'madrid', 'paris'],
    'lQueryWords' : ['capital', 'country'],
  }
};

Cotton.Test.Data.Pretreatment.oHistoryItemNull = {
  'oExtractedDNA' : {
    'lExtractedWords' : [],
    'lQueryWords' : [],
  }
};

      },
      'teardown' : function() {
        // runs after each test
      }
    }
);

test("computeParseUrl.", function() {
  Cotton.Algo.PreTreatment.computeParseUrl([
    Cotton.Test.Data.Pretreatment.oHistoryItem1,
    Cotton.Test.Data.Pretreatment.oHistoryItem2,
    Cotton.Test.Data.Pretreatment.oHistoryItem3]);

  equal(Cotton.Test.Data.Pretreatment.oHistoryItem1['sHostname'], "www.imdb.com");
});


test("compute closest generated page.", function() {

  Cotton.Algo.PreTreatment.computeParseUrl([
    Cotton.Test.Data.Pretreatment.oHistoryItem1,
    Cotton.Test.Data.Pretreatment.oHistoryItem2,
   Cotton.Test.Data.Pretreatment. oHistoryItem3]);
  Cotton.Algo.PreTreatment.computeClosestGoogleSearchPage([
    Cotton.Test.Data.Pretreatment.oHistoryItem1,
    Cotton.Test.Data.Pretreatment.oHistoryItem2,
    Cotton.Test.Data.Pretreatment.oHistoryItem3]);
  equal(
    Cotton.Test.Data.Pretreatment.oHistoryItem1['oExtractedDNA']['sClosestGoogleSearchPage'],
    "https://www.google.com/search?q=alice+in+wonderland&oq=etherpad");
});

test("computeExtractedWords.", function() {
  var lHistoryItem = japan;
  // Needed to compute ExtractedWords.
  // FIXME(rmoutard): avoid dependances.
  lHistoryItem = Cotton.Algo.PreTreatment.computeParseUrl(lHistoryItem);
  Cotton.Algo.PreTreatment.computeExtractedWords(lHistoryItem);
  deepEqual(lHistoryItem[7]['oExtractedDNA']['lExtractedWords'],
    ["time", "tokyo", "recherche", "google", "search"]);
});

