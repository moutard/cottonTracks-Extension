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

  mergeBag : function(dBagOfWords) {
    for (var sWord in dBagOfWords){
      this.addWord(sWord, dBagOfWords[sWord]);
    }
  },

  increaseWordScore : function(sWord, iScore) {
    this._dBag[sWord.toLowerCase()] += iScore;
  },

  get : function() {
    return this._dBag;
  },

  getWords : function() {
    var lWords = [];
    for(var sWord in this._dBag) lWords.push(sWord);
    return lWords;
  },

  preponderant : function(iNumberOfPreponderant){
    var lSortedWordsByWeight = {};
    var iMaxWeight = 0;

    for (var sKey in this._dBag){
      if (!lSortedWordsByWeight[this._dBag[sKey]]){
        lSortedWordsByWeight[this._dBag[sKey]] = [];
        if (this._dBag[sKey] > iMaxWeight){
          iMaxWeight = this._dBag[sKey];
        }
      }
      lSortedWordsByWeight[this._dBag[sKey]].push(sKey);
    }
    if (iMaxWeight > 0){
      var lPreponderant = lSortedWordsByWeight[iMaxWeight];
      if (lSortedWordsByWeight[iMaxWeight-1]
        && lSortedWordsByWeight[iMaxWeight-1].length > 0){
          lPreponderant = lPreponderant.concat(lSortedWordsByWeight[iMaxWeight-1]);
      }
      return lPreponderant;
    } else {
      return [];
    }
  },

  size : function(){
    var iSize = 0;
    for (var word in this._dBag){
      iSize++;
    }
    return iSize;
  },

  maxWeight : function(){
    var iMaxWeight = 0;
    for (var word in this._dBag){
      if (this._dBag[word] > iMaxWeight){
        iMaxWeight = this._dBag[word];
      }
    }
    return iMaxWeight;
  },

});
