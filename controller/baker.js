"use strict";

Cotton.Controllers.Baker = Class.extend({

  init : function(oLightyearController, oGlobalDispatcher){
    this._oLightyearController = oLightyearController;
    this._oGlobalDispatcher = oGlobalDispatcher;
  },

  // Given a set of querywords and historyItems, we sort the historyItems like on a target
  // bullseye > items with the best scores and down to 1.2 times less the best score
  // 1st crown > items not in the bullseye but related to items in the bullseye with the same rule
  // 2nd crown > etc...
  bake : function(lHistoryItems, lQueryWords) {
    var NUMBER_OF_CROWN = 5;
    var TOLERANCE = 1.2;
    var iQueryLength = lQueryWords.length;

    // Create a bag of words with the search terms
    var oSearchBagOfWords = new Cotton.Model.BagOfWords();
    for (var i = 0; i < lQueryWords.length; i++) {
      oSearchBagOfWords.addWord(lQueryWords[i], 1);
    }

    // "target" because of the classification (bullseye, 1st crown, ...)
    var lTarget = [];
    var lTags = [oSearchBagOfWords];

    var oCheescake = new Cotton.Model.Story()
    this._oLightyearController._oWorld.clear();

    this._oLightyearController.openStory(oCheescake, []);

    for (var i = 0; i < NUMBER_OF_CROWN; i++) {
      var oMatchTags = new Cotton.Model.BagOfWords();
      var lMatches = [];
      var lMissed = [];
      var iMaxScore = 0;
      var dItemsRank = {};
      for (var j = 0; j < lHistoryItems.length; j++) {
        var oHistoryItem = lHistoryItems[j];
        // If a historyItem has all the keywords, push it up a little bit.
        // because if it had only weights of 3 it can be pushed down a lot
        if (i === 0 && _.intersection(lQueryWords, oHistoryItem.extractedDNA().bagOfWords().getWords()).length === lQueryWords.length) {
          for (var sKey in oSearchBagOfWords.get()) {
            oHistoryItem.extractedDNA().bagOfWords().addWord(sKey, Math.max(4, oHistoryItem.extractedDNA().bagOfWords().get()[sKey]));
          }
        }
        // Compute the score of the item relative to the query
        oHistoryItem.score = Cotton.Algo.Score.DBRecord.BagOfWords(
          oHistoryItem.extractedDNA().bagOfWords().get(), lTags[lTags.length-1].get());
        // Keep the max score
        if (oHistoryItem.score > iMaxScore) {
          iMaxScore = oHistoryItem.score;
        }
        dItemsRank[oHistoryItem.score] = (dItemsRank[oHistoryItem.score]) ? dItemsRank[oHistoryItem.score] : [];
        dItemsRank[oHistoryItem.score].push(oHistoryItem);
      }
      for (var key in dItemsRank) {
        if (key > iMaxScore/TOLERANCE) {
          var jLength = dItemsRank[key].length;

          lMatches = lMatches.concat(dItemsRank[key]);
          for (var j = 0; j < jLength; j++) {
            var oHistoryItem = dItemsRank[key][j];
            for (var sKey in oHistoryItem.extractedDNA().bagOfWords().get()){
              oMatchTags.addWord(sKey, 1);
            }
          }
        } else {
          // Remaining items, not in this crown, will be used for next crowns
          lMissed = lMissed.concat(dItemsRank[key]);
        }
      }

      lTarget.push(lMatches);
      lHistoryItems = lMissed;
      lTags.push(oMatchTags);

      // Sort items by score in a crown, and by specificity
      // by ponderating with the number of words
      for (var j = 0; j < lMatches.length; j++) {
        // For testing purpose, remember the crown to display different colors
        if (DEBUG) lMatches[j].target = i;
        lMatches[j].score = lMatches[j].score / (1 + lMatches[j].extractedDNA().bagOfWords().getWords().length / 10);
      }
      lMatches.sort(function(a,b){return b.score - a.score});

      // send items to the UI to add them
      this._oGlobalDispatcher.publish('add_cards', {
        'history_items' : lMatches
      });
    }

    // sort tags to display them all
    var dTopTags = {};
    var iLength = lTags.length;
    for (var i = 0; i < iLength; i++) {
      for (var key in lTags[i].get()) {
        var iCoeff = (lQueryWords.indexOf(key) === -1) ? (iLength-i) : (iLength-i)*2 ;
        var oBagOfWords = lTags[i].get();
        dTopTags[key] = dTopTags[key] || 0;
        dTopTags[key] += oBagOfWords[key] * iCoeff;
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

    // send tags to UI to display them
    this._oGlobalDispatcher.publish('show_tags', {
      'tags' : dSortedTags
    });
  }

});