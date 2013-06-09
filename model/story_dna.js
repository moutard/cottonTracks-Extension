'use strict';

/**
 * ExtractedDNA
 *
 * This class is used to store all the relevent elements from a page. We extract
 * the DNA of the page, like score on each block, keywords, hightlight... That's
 * why it's called PageDNA. The extractedDNA depends on the visit.
 */

Cotton.Model.StoryDNA = Cotton.DB.Model.extend({

  _oBagOfWords : null,

  _default: function() {
    return {
      'oBagOfWords': this._oBagOfWords
    };
  },

  init : function(dDBRecord){
    this._super(dDBRecord);
    this._oBagOfWords = new Cotton.Model.BagOfWords();
    this._dDBRecord['oBagOfWords'] = this._oBagOfWords.get();
  },

  bagOfWords : function() {
    return this._oBagOfWords;
  },

  setBagOfWords : function(oBagOfWords) {
    this._oBagOfWords = oBagOfWords;
  },

  addWord : function(sWord, iWeight) {
    this._oBagOfWords.addWord(sWord, iWeight);
  },

  addListWords : function(lWords, iWeight) {
    for (var i = 0, sWord; sWord = lWords[i]; i++) {
      this.addWord(sWord, iWeight);
    }
  }

});
