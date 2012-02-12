'use strict';

var oHistoryItem1;
var oHistoryItem2;
var oHistoryItem3;
var lHistoryItems;
module("Distance", {
  setup: function() {
    // runs before each test
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
    
    oHistoryItem3 = {
        id: "55926",
        lastVisitTime: 1328733169850.535,
        title: "Mash-up #5 : Rencontres étudiants-entrepreneurs lundi prochain",
        typedCount: 0,
        url: "http://fr.techcrunch.com/2012/02/02/mash-up-5-rencontres-etudiants-entrepreneurs-lundi-prochain/",
        visitCount: 1  
    };
    
    lHistoryItems = Array(oHistoryItem1, oHistoryItem2, oHistoryItem3);
  },
  teardown: function() {
    // runs after each test
  }
});

  

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

module("DBSCAN algorithm",{
  setup: function() {
    // runs before each test
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
    
    oHistoryItem3 = {
        id: "55926",
        lastVisitTime: 1328733169850.535,
        title: "Mash-up #5 : Rencontres étudiants-entrepreneurs lundi prochain",
        typedCount: 0,
        url: "http://fr.techcrunch.com/2012/02/02/mash-up-5-rencontres-etudiants-entrepreneurs-lundi-prochain/",
        visitCount: 1  
    };
    
    lHistoryItems = Array(oHistoryItem1, oHistoryItem2, oHistoryItem3);
  },
  teardown: function() {
    // runs after each test
  }
});

test("initSetOfPoints", function(){
  
  initSetOfPoints(lHistoryItems);
  equal(lHistoryItems[0].clusterId, "UNCLASSIFIED", 'Cluster should be unclassified');
  
});

test("One Cluster", function() {
  var lHistoryItems = Array(oHistoryItem1, oHistoryItem2);
  initSetOfPoints(lHistoryItems);
  var iNbCluster = DBSCAN(lHistoryItems, 50000, 1);
  
  equal(lHistoryItems[0].clusterId, 0, 'Cluster non classé');
  equal( iNbCluster, 1, "Different" );
  
});


