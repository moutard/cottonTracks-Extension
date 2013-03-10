'use strict';
var oHistoryItem1 = {
  sUrl:"http://fr.wikipedia.org/wiki/EtherPad",
  sTitle: "EtherPad - Wikipédia",
  iLastVisitTime:1361980612982.948,
  oExtractedDNA : {
    lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
    lQueryWords : ['alice', 'wonderland', 'film', 'telerama'],
  }
};

var oHistoryItem2 = {
  sUrl:"http://fr.wikipedia.org/wiki/EtherPad",
  sTitle: "EtherPad - Wikipédia",
  iLastVisitTime:1361980612982.948,

  oExtractedDNA : {
    lExtractedWords : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll', 'novel'],
    lQueryWords : ['alice', 'wonderland', 'novel'],
  }
};

var oHistoryItem3 = {
  sUrl:"https://www.google.com/search?q=etherpad&oq=etherpad",
  sTitle: "EtherPad - Google search",
  iLastVisitTime:1361980612982.948,

  oExtractedDNA : {
    lExtractedWords : ['singapor', 'madrid', 'paris'],
    lQueryWords : ['capital', 'country'],
  }
};

var oHistoryItemNull = {
  oExtractedDNA : {
    lExtractedWords : [],
    lQueryWords : [],
  }
};
module(
    "Cotton.Algo.Pretreatment",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);


test("distance key.", function() {
  Cotton.Algo.PreTreatment.computeClosestGeneratedPage([oHistoryItem1, oHistoryItem2, oHistoryItem3]);
  equal(oHistoryItem1['oExtractedDNA']['sClosestGeneratedPage'], "https://www.google.com/search?q=etherpad&oq=etherpad");
});

