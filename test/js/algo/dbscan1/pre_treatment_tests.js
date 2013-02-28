'use strict';
var oVisitItem1 = {
  sUrl:"http://fr.wikipedia.org/wiki/EtherPad",
  sTitle: "EtherPad - Wikipédia",
  iVisitTime:1361980612982.948,
  oExtractedDNA : {
    lExtractedWords : ['alice', 'wonderland', 'movie', 'Burton', 'Tim'],
    lQueryWords : ['alice', 'wonderland', 'film', 'telerama'],
  }
};

var oVisitItem2 = {
  sUrl:"http://fr.wikipedia.org/wiki/EtherPad",
  sTitle: "EtherPad - Wikipédia",
  iVisitTime:1361980612982.948,

  oExtractedDNA : {
    lExtractedWords : ['alice', 'adventure', 'wonderland', 'lewis', 'carroll', 'novel'],
    lQueryWords : ['alice', 'wonderland', 'novel'],
  }
};

var oVisitItem3 = {
  sUrl:"https://www.google.com/search?q=etherpad&oq=etherpad",
  sTitle: "EtherPad - Google search",
  iVisitTime:1361980612982.948,

  oExtractedDNA : {
    lExtractedWords : ['singapor', 'madrid', 'paris'],
    lQueryWords : ['capital', 'country'],
  }
};

var oVisitItemNull = {
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


test("Cotton.Algo.Distance - distance key.", function() {
  Cotton.Algo.PreTreatment.computeClosestGeneratedPage([oVisitItem1, oVisitItem2, oVisitItem3])
});

