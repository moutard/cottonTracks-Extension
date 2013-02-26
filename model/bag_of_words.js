'use strict';

/**
 * Bag Of Words.
 *
 * List of words present in the doc with their score. So the dna can be
 * represented as a vector.
 * Score can be frequency for example, but we can imagine more sophisticated
 * with bonus if the words was copy pasted or highlighted.
 */

Cotton.Model.BagOfWords = Class.extend({

  _lBag : {}, // dictionary has some advantages and drawbacks but let's use it for the moemnt.

  init : function(){
    var self = this;
  },

  addWord : function(sWord, iScore){
    var self = this;
    self._lBag[sWord] = iScore;
  },

  get : function(){
    return this._lBag;
  },
});
