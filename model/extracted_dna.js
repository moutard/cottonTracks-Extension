'use strict';

/**
 * ExtractedDNA
 *
 * This class is used to store all the relevent elements from a page. We extract
 * the DNA of the page, like score on each block, keywords, hightlight... That's
 * why it's called PageDNA. The extractedDNA depends on the visit.
 */

Cotton.Model.ExtractedDNA = Class.extend({

  _iPercent : 0,
  _fPageScore : 0,
  _lScores : [],
  _lHighlightedText : [],
  _sImageUrl : "",
  _iImageCropped : 0,
  _iImageMarginTop : 0,
  _iScrollablePosition : undefined,
  _sFirstParagraph : "",

  /**
   * @constructor
   */
  init : function() {
    this._iPercent = 0;
    this._fPageScore = 0;
    this._lScores = [];
    this._lHighlightedText = [];
    this._sImageUrl = "";
    this._sFirstParagraph = "";
  },

  scores : function() {
    return this._lScores;
  },
  addScore : function(oScore) {
    this._lScores.push(oScore);
  },
  setScores : function(lScores) {
    this._lScores = lScores;
  },

  highlightedText : function() {
    return this._lHighlightedText;
  },
  addHighlightedText : function(sText) {
    this._lHighlightedText.push(sText);
  },
  setHighlightedText : function(lHighlightedText) {
    this._lHighlightedText = lHighlightedText;
  },
  imageUrl : function() {
    return this._sImageUrl;
  },
  setImageUrl : function(sImageUrl) {
    this._sImageUrl = sImageUrl;
  },
  imageCropped : function(){
    return this._iImageCropped;
  },
  setImageCropped : function(isCropped){
    this._iImageCropped = isCropped;
  },
  imageMarginTop : function(){
    return this._iImageMarginTop;
  },
  setImageMarginTop : function(iMarginTop){
    this._iImageMarginTop = iMarginTop;
  },
  scrollablePosition : function(){
    return this._iScrollablePosition;
  },
  setScrollablePosition : function(iScrollablePosition){
    this._iScrollablePosition = iScrollablePosition;
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

});
