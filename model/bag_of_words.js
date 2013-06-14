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

  /**
   * Remove and replace the bag of words by the given one, but ensure
   * that all the words are lowsercase.
   * @param {Dictionnary} dBag:
   *  - key: {String} word
   *  - value: {Float} score of the word. Bigger means that this word is
   *  more important in this document.
   */
  setBag : function(dBag) {
    this._dBag = {};
    for(var sKey in dBag) {
      this._dBag[sKey.toLowerCase()] = dBag[sKey];
    }
  },

  /**
   *  Add a word expect if this words already exists in this case the max
   *  value score is saved.
   * @param {String} sWord:
   *    word you want to add in the bag of words.
   * @param {Int} iScore:
   *    score attached to it's words. If score is not specified it becomes
   */
  addWord : function(sWord, iScore) {
    if (!this._dBag[sWord.toLowerCase()] || this._dBag[sWord.toLowerCase()] < iScore) {
      this._dBag[sWord.toLowerCase()] = iScore;
    }
  },

  /**
   * @param {Dictionnary} dBagOfWords:
   *  given a bag of words as a dictionnary, merges it with the current one.
   */
  mergeBag : function(dBagOfWords) {
    for (var sWord in dBagOfWords) {
      this.addWord(sWord, dBagOfWords[sWord]);
    }
  },

  increaseWordScore : function(sWord, iScore) {
    var iTempScore = this._dBag[sWord.toLowerCase()] || 0;
    this._dBag[sWord.toLowerCase()] = iTempScore + iScore;
  },

  get : function() {
    return this._dBag;
  },

  /**
   * Return the words that have the highest score.
   * @param {Int} iNumberOfPreponderant:
   *  number of words you want. (3 by default)
   *  FIXME(rmoutard): seems really complicated for a simple function...
   */
  preponderant : function(iNumberOfPreponderant) {
    iNumberOfPreponderant = iNumberOfPreponderant || 3;
    var lPreponderant = [];
    //TODO(rmoutard) : find a faster method.
    _.each(_.pairs(this._dBag).sort(function(lPairA, lPairB){
      // Sort by increasing order.
      return lPairB[1] - lPairA[1];
    }).slice(0, iNumberOfPreponderant), function(lPair){
      lPreponderant.push(lPair[0]);
    });
    var lSortedWordsByWeight = {};
    var iMaxWeight = 0;

    return lPreponderant;
  },

  size : function() {
    // TODO(rmoutard): use keys property
    // http://stackoverflow.com/questions/126100/how-to-efficiently-count-the-number-of-keys-properties-of-an-object-in-javascrip
    var iSize = 0;
    for (var word in this._dBag) {
      iSize++;
    }
    return iSize;
  },

  //FIXME(rmoutard) rename maxScore to be coherent with others notation.
  maxWeight : function() {
    var iMaxWeight = 0;
    for (var word in this._dBag) {
      if (this._dBag[word] > iMaxWeight) {
        iMaxWeight = this._dBag[word];
      }
    }
    return iMaxWeight;
  },

  /**
   * Return all the words that are in the dictionnary as a list. Don't care
   * about he weight.
   * @return {Array.<String>} list of all the words in the bag of words.
   */
  //FIXME(rmoutard): rename words to be coherent.
  getWords : function() {
    return _.keys(this._dBag);
  }

});
