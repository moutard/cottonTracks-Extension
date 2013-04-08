'use strict';


module(
    "Cotton.Algo.WordsRepartition",
    {
      setup : function() {

      },
      teardown : function() {
        // runs after each test
      }
    }
);

test("words repartition for foot.", function() {
  expect(0);
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_history_source_foot;
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    for(var sWord in oHistoryItem.extractedDNA().bagOfWords().get()){
      dWordsRepartition[sWord] = (dWordsRepartition[sWord] + 1) || 1;
    }
  }

  DEBUG && console.debug(dWordsRepartition);
});

test("words repartition for hadrien.", function() {
  expect(0);
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_history_source_hadrien;
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    for(var sWord in oHistoryItem.extractedDNA().bagOfWords().get()){
      dWordsRepartition[sWord] = (dWordsRepartition[sWord] + 1) || 1;
    }
  }

  DEBUG && console.debug(_.sortBy(_.pairs(dWordsRepartition), function(L){
    return -1*L[1];
  }));
});

test("words repartition for big.", function() {
  expect(0);
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_history_source_big;
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    for(var sWord in oHistoryItem.extractedDNA().bagOfWords().get()){
      dWordsRepartition[sWord] = (dWordsRepartition[sWord] + 1) || 1;
    }
  }

  DEBUG && console.debug(_.sortBy(_.pairs(dWordsRepartition), function(L){
    return -1*L[1];
  }));
});

test("words repartition for year.", function() {

  var dWordsRepartition = {};
  var total = year_00.length + year_01.length + year_02.length;
  DEBUG && console.debug("number of elements in history:" + total);
  var lHistoryItems = Cotton.DB.Populate.Suite(year_00);
  lHistoryItems.concat(Cotton.DB.Populate.Suite(year_01));
  lHistoryItems.concat(Cotton.DB.Populate.Suite(year_02));
  DEBUG && console.debug("number of elements in history:" + lHistoryItems.length);
  for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    for(var sWord in oHistoryItem.extractedDNA().bagOfWords().get()){
      dWordsRepartition[sWord] = (dWordsRepartition[sWord] + 1) || 1;
    }
  }
  var l = _.sortBy(_.pairs(dWordsRepartition), function(L){
    return -1*L[1];
  });
  var sMessage = "";
  var temp = l.slice(0,20);
  for(var i=0; i < temp.length; i++){
    sMessage += " / " + temp[i][0] + ": " + temp[i][1];
  }
  DEBUG && console.debug(l);

  ok(l.slice(0,20).length > 19, sMessage);

});

test("no history items with no bag of words.", function() {
  var iNbWithoutBagOfWords = 0;
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_history_source_hadrien.slice();
  var lHistoryItems = Cotton.DB.Populate.Suite(lSampleHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    if(_.isEmpty(oHistoryItem.extractedDNA().bagOfWords().get())){
      iNbWithoutBagOfWords+=1;
    }
  }
  equal(iNbWithoutBagOfWords, 0);
});

