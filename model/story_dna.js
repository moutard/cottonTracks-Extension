'use strict';

/**
 * ExtractedDNA
 *
 * This class is used to store all the relevent elements from a page. We extract
 * the DNA of the page, like score on each block, keywords, hightlight... That's
 * why it's called PageDNA. The extractedDNA depends on the visit.
 */

Cotton.Model.StoryDNA = Class.extend({

  _oBagOfWords : null,

  init : function(){
    var self = this;
    self._oBagOfWords = new Cotton.Model.BagOfWords();
  },

  bagOfWords : function(){
    return this._oBagOfWords;
  },

  setBagOfWords : function(oBagOfWords){
    this._oBagOfWords = oBagOfWords;
  },

  addWord : function(sWord, iWeight){
    this._oBagOfWords.addWord(sWord, iWeight);
  },

  addListWords : function(lWords, iWeight){
    var iLength = lWords.length;
    for (var i = 0; i < iLength; i++) {
      var sWord = lWords[i];
      this.addWord(sWord, iWeight);
    }
  }
});
