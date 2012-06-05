'use strict';

// This class is used to store all the relevent elements from a page. We extract
// the DNA of the page, like score on each block, keywords, hightlight...
// That's why it's called PageDNA.
// The extractedDNA depends on the visit.
Cotton.Model.ExtractedDNA = Class.extend({

  init : function() {
    this._iPercent = 0;
    this._fPageScore = 0;
    this._lScores = [];
    this._lHighlightedText = [];
    this._sImageUrl = "";
    this._sFirstParagraph = "";
    // TODO(rmoutard) : see with fwouts the model of textHighLigter
    // this._lTextHighlighter = [];
    // this._iScrollCount = 0;
    // this._lCopyPaste = [];
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
    this._lHighlightedText.push(sText);
  },
  imageUrl : function() {
    return this._sImageUrl;
  },
  setImageUrl : function(sImageUrl) {
    this._sImageUrl = sImageUrl;
  },
  percent : function() {
    return this._iPercent;
  },
  setPercent : function(iPercent) {
    this._iPercent = iPercent;
  },
  pageScore : function() {
    return this._fPageScore;
  },
  setPageScore : function(fPageScore) {
    this._fPageScore = fPageScore;
  },
  firstParagraph : function() {
    return this._sFirstParagraph;
  },
  setFirstParagraph : function(sFirstParagraph) {
    this._sFirstParagraph = sFirstParagraph;
  },
/*
 * textHighLighter : function() { return this._sTextHighlighter; },
 * setTextHighLighter : function(highLight) {
 * this._sTextHighlighter.push(highLight); }, scrollCount : function() { return
 * this._iScrollCount; }, setScrollCount : function(scrollCount) {
 * this._iScrollCount = scrollCount; }, copyPaste : function() { return
 * this._lCopyPaste; }, setCopyPaste : function(copyPaste) {
 * this._lCopyPaste.push(copyPaste); },
 */

});
