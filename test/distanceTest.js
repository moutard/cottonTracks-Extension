'use strict';

module("Distance");

var oHistoryItem1;
var oHistoryItem2;

  oHistoryItem1 = {
      id: "55926",
      lastVisitTime: 1328733177037.728,
      title: "L’université Paris Dauphine organise le 1er février un Barcamp géant pour l’entrepreneuriat dans les universités",
      typedCount: 0,
      url: "http://fr.techcrunch.com/2012/01/30/luniversite-paris-dauphine-organise-le-1er-fevrier-un-barcamp-geant-pour-lentrepreneuriat-dans-les-universites/",
      visitCount: 1
  };
  
  oHistoryItem2 = {
      id: "55925",
      lastVisitTime: 1328733160850.535,
      title: "Mash-up #5 : Rencontres étudiants-entrepreneurs lundi prochain",
      typedCount: 0,
      url: "http://fr.techcrunch.com/2012/02/02/mash-up-5-rencontres-etudiants-entrepreneurs-lundi-prochain/",
      visitCount: 1  
  };

test("Calcule distance LastVisitTime", function() {
  var fExpectedValue = 16187.193115234375 ;
  var fDistance = distanceLastVisitTime(oHistoryItem1, oHistoryItem2);
  
  var sMessage =  "The value of the distance has changed \n" ;
  sMessage += "Expected Value is " + fExpectedValue + " but the computed distance is " +  fDistance ;
  equal( fDistance, fExpectedValue, sMessage );
});

test("Calcule distance Complexe", function() {
  
  var fExpectedValue = 6475.27724609375 ;
  var fDistance = distanceComplexe(oHistoryItem1, oHistoryItem2);
  var sMessage =  "The value of the distance has changed \n" ;
      sMessage += "Expected Value is " + fExpectedValue + "but the computed distance is " +  fDistance ;
  equal( fDistance, fExpectedValue, sMessage );
});

test("second test within module", function() {
  ok( true, "all pass" );
});

module("DBSCAN algorithm");

test("some other test", function() {
  expect(2);
  equal( true, false, "failing test" );
  equal( true, true, "passing test" );
});


