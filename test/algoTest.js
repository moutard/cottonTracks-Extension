DistanceTest = TestCase("DistanceTest");

DistanceTest.prototype.testDistance = function(){
  var oHistoryItems1 = {
      id: "55926",
      lastVisitTime: 1328733177037.728,
      title: "L’université Paris Dauphine organise le 1er février un Barcamp géant pour l’entrepreneuriat dans les universités",
      typedCount: 0,
      url: "http://fr.techcrunch.com/2012/01/30/luniversite-paris-dauphine-organise-le-1er-fevrier-un-barcamp-geant-pour-lentrepreneuriat-dans-les-universites/",
      visitCount: 1
  };
  
  var oHistoryItems2 = {
      id: "55925",
      lastVisitTime: 1328733160850.535,
      title: "Mash-up #5 : Rencontres étudiants-entrepreneurs lundi prochain",
      typedCount: 0,
      url: "http://fr.techcrunch.com/2012/02/02/mash-up-5-rencontres-etudiants-entrepreneurs-lundi-prochain/",
      visitCount: 1  
  };
  
  var fDistance = distanceComplexe(historyItems1, historyItems2);
  console.log("What !! " + fDistance);
  
  assertEquals(fDistance, 5.0);
};