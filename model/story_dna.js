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

  init: function(){
    var self = this;
    self._oBagOfWords = new Cotton.Model.BagOfWords();
  },

});