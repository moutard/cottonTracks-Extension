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

test("words repartition for hadrien.", function() {
  expect(0);
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_history_source_hadrien;
  lSampleHistoryItems = Cotton.Core.Populate.preRemoveTools(lSampleHistoryItems);
  var lCottonHistoryItems = Cotton.Core.Populate.translateListOfChromeHistoryItems(lSampleHistoryItems);
  lCottonHistoryItems = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lCottonHistoryItems);
  lCottonHistoryItems = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lCottonHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lCottonHistoryItems[i]; i++){
    for(var sWord in oHistoryItem.extractedDNA().bagOfWords().get()){
      dWordsRepartition[sWord] = (dWordsRepartition[sWord] + 1) || 1;
    }
  }

  DEBUG && console.debug(_.sortBy(_.pairs(dWordsRepartition), function(L){
    return -1*L[1];
  }));
});

test("words repartition for japan.", function() {
  expect(0);
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_history_source_japan;
  lSampleHistoryItems = Cotton.Core.Populate.preRemoveTools(lSampleHistoryItems);
  var lCottonHistoryItems = Cotton.Core.Populate.translateListOfChromeHistoryItems(lSampleHistoryItems);
  lCottonHistoryItems = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lCottonHistoryItems);
  lCottonHistoryItems = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lCottonHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lCottonHistoryItems[i]; i++){
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
  var total = chrome_visit_source_blue.length + chrome_visit_source_green.length
    + chrome_visit_source_pink.length + chrome_visit_source_red.length;
  DEBUG && console.debug("number of elements in history:" + total);

  var lBlue = Cotton.Core.Populate.preRemoveTools(chrome_visit_source_blue);
  lBlue = Cotton.Core.Populate.translateListOfChromeHistoryItems(lBlue);
  lBlue = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lBlue);
  lBlue = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lBlue);

  var lGreen = Cotton.Core.Populate.preRemoveTools(chrome_visit_source_green);
  lGreen = Cotton.Core.Populate.translateListOfChromeHistoryItems(lGreen);
  lGreen = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lGreen);
  lGreen = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lGreen);

  var lPink = Cotton.Core.Populate.preRemoveTools(chrome_visit_source_pink);
  lPink = Cotton.Core.Populate.translateListOfChromeHistoryItems(lPink);
  lPink = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lPink);
  lPink = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lPink);

  var lRed = Cotton.Core.Populate.preRemoveTools(chrome_visit_source_red);
  lRed = Cotton.Core.Populate.translateListOfChromeHistoryItems(lRed);
  lRed = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lRed);
  lRed = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lRed);

  var lHistoryItems = lBlue.concat(lGreen).concat(lPink).concat(lRed);
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
  lSampleHistoryItems = Cotton.Core.Populate.preRemoveTools(lSampleHistoryItems);
  var lCottonHistoryItems = Cotton.Core.Populate.translateListOfChromeHistoryItems(lSampleHistoryItems);
  lCottonHistoryItems = Cotton.Core.Populate.computeBagOfWordsForHistoryItemsList(lCottonHistoryItems);
  lCottonHistoryItems = Cotton.Core.Populate.removeHistoryItemsWithoutBagOfWords(lCottonHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lCottonHistoryItems[i]; i++){
    if(_.isEmpty(oHistoryItem.extractedDNA().bagOfWords().get())){
      iNbWithoutBagOfWords+=1;
    }
  }
  equal(iNbWithoutBagOfWords, 0);
});

