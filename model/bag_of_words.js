'use strict';

/**
 * Bag Of Words.
 *
 * List of words present in the doc with their score. So the dna can be
 * represented as a vector.
 * Score can be frequency for example, but we can imagine more sophisticated
 * with bonus if the words was copy pasted or highlighted. But this intelligence
 *  shouldn't be in the bag of words structure.
 */

Cotton.Model.BagOfWords = Class.extend({

  /**
   * {Dictionnary} _lBag:
   *  - key: {String} word
   *  - value: {Float} score of the word. Bigger means that this word is
   *  more important in this document.
   *
   *  Advantages of dictionnary structure :
   *  words are sorted by alphabetical order. So easy to made a vector mode.
   */
  _dBag : null,

  init : function(dBag) {
    this._dBag = {};
    if (dBag) this.setBag(dBag);
  },

  setBag : function(dBag){
    for(var sKey in dBag){
      this._dBag[sKey.toLowerCase()] = dBag[sKey];
    }
  },

  addWord : function(sWord, iScore) {
    if (!this._dBag[sWord.toLowerCase()] || this._dBag[sWord.toLowerCase()] < iScore){
      this._dBag[sWord.toLowerCase()] = iScore;
    }
  },

  increaseWordScore : function(sWord, iScore) {
    this._dBag[sWord.toLowerCase()] += iScore;
  },

  get : function() {
    return this._dBag;
  },

  preponderant : function(iNumberOfPreponderant){
    var lPreponderant = [];
    //TODO(rmoutard) : find a faster method.
    _.each(_.pairs(this._dBag).sort(function(lPairA, lPairB){
      // Sort by increasing order.
      return lPairB[1] - lPairA[1];
    }).slice(0, iNumberOfPreponderant), function(lPair){
      lPreponderant.push(lPair[0]);
    });

    return lPreponderant;
  },

  size : function(){
    var iSize = 0;
    for (var word in this.get()){
      iSize++;
    }
    return iSize;
  }
});
