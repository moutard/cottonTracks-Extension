"use strict";

Cotton.Controllers.Baker = Class.extend({

  init : function(oLightyearController, oGlobalDispatcher){
    this._oLightyearController = oLightyearController;
  },

  // given a set of querywords and historyItems, we sort the historyItems like on a target
  // bullseye > items with the querywords in bag of words
  // 1st crown > items not in the bullseye but related to items in the bullseye
  // 2nd crown > etc...
  bake : function(lHistoryItems, lQueryWords) {
    var NUMBER_OF_CROWN = 3;
    var iQueryLength = lQueryWords.length;

    // create a bag of words with the search terms
    var oSearchBagOfWords = new Cotton.Model.BagOfWords();
    for (var i = 0; i < lQueryWords.length; i++) {
      oSearchBagOfWords.addWord(lQueryWords[i], 3)
    }

    // "target" because of the classification (bullseye, 1st crown, ...)
    var lTarget = [];
    var lTags = [oSearchBagOfWords];
    var iDiv = 1;

    for (var i = 0; i < NUMBER_OF_CROWN; i++) {
      var oMatchTags = new Cotton.Model.BagOfWords();
      var lMatches = [];
      var lMissed = [];
      for (var j = 0; j < lHistoryItems.length; j++) {
        if (Cotton.Algo.Score.DBRecord.BagOfWords(
          lHistoryItems[j].extractedDNA().bagOfWords().get(), lTags[lTags.length - 1].get()) > 0) {
            // there is at least one tag in previous zone common to the item bagOfWords
            lMatches.push(lHistoryItems[j]);
            for (var key in lHistoryItems[j].extractedDNA().bagOfWords().get()){
              if (!lTags[lTags.length-1].get()[key]) {
                // keep track of the popularity of a tag for this zone, to attribute it a score
                oMatchTags.get()[key] = oMatchTags.get()[key] || 0;
                oMatchTags.get()[key] += lHistoryItems[j].extractedDNA().bagOfWords().get()[key];
              }
            }
        } else {
          lMissed.push(lHistoryItems[j]);
        }
      }
      lTarget.push(lMatches);
      lHistoryItems = lMissed;

      // now we want to regularise all tags in this target zone
      // we divide all tags weight by the product of the maxs of every zone
      var iMax = 0;
      for (var key in oMatchTags.get()) {
        if (oMatchTags.get()[key] > iMax) {
          iMax = oMatchTags.get()[key];
        }
      }
      // iDiv was init to 1
      var iDiv = iMax * iDiv || iDiv;

      for (var key in oMatchTags.get()) {
        oMatchTags.get()[key] = oMatchTags.get()[key]/iDiv;
      }
      lTags.push(oMatchTags);
    }

    // set which target zone the item is in, for color code
    lHistoryItems = [];
    for (var i = 0; i < lTarget.length; i++) {
      for (var j = 0; j < lTarget[i].length; j++) {
        lTarget[i][j].target = i;
        lHistoryItems.push(lTarget[i][j]);
      }
    }

    // sort tags to display them all
    var dTopTags = {};
    for (var i = 0; i < lTags.length; i++) {
      for (var key in lTags[i].get()) {
        dTopTags[key] = lTags[i].get()[key]*iDiv;
      }
    }
    var lSortedTags = [];
    for (var key in dTopTags) {
      lSortedTags.push([key, dTopTags[key]]);
    }
    lSortedTags.sort(function(a,b){return b[1]-a[1]});
    var lTags = Object.keys(dTopTags).sort(function(a, b) {return -(dTopTags[a] - dTopTags[b])});
    var dSortedTags = {};
    for (var i = 0; i < lTags.length; i++) {
      dSortedTags[lTags[i]] = dTopTags[lTags[i]];
    }

    // sort items by computing their score against the ponderated tags.
    for (var i = 0; i < lHistoryItems.length; i++) {
      lHistoryItems[i].score = Cotton.Algo.Score.DBRecord.BagOfWords(
        lHistoryItems[i].extractedDNA().bagOfWords().get(), dTopTags) * iQueryLength / Math.max(iQueryLength, lHistoryItems[i].extractedDNA().bagOfWords().getWords().length);
    }
    lHistoryItems.sort(function(a,b){return b.score - a.score});

    var oCheescake = new Cotton.Model.Story()
    oCheescake.setHistoryItems(lHistoryItems);
    oCheescake.occurenceTags = dSortedTags;

    this._oLightyearController._oWorld.clear();
    this._oLightyearController.openStory(oCheescake, []);
  }
});