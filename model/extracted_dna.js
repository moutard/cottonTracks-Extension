'use strict';

// This class is used to store all the relevent elements from a page. We extract
// the DNA of the page, like score on each block, keywords, hightlight...
// That's why it's called PageDNA.
// The extractedDNA depends on the visit.
Cotton.Model.extractedDNA = Class.extend({

  init: function() {
    this._lScores = [];
    this._lHighlightedText = [];
  },

  scores : function() {
    return this._lScores;
  },
  addScore : function(oScore) {
    this._lScores.push(oScore);
  },
  highLightedText : function() {
    return this._lHighlightedText;
  },
  addHighLightedText : function(sText) {
   this.push(sText);
  },

});

