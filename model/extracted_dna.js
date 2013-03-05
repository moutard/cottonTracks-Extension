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
  _fTimeTabActive : -1,
  _fTimeTabOpen : -1,
  _lHighlightedText : [],
  _sImageUrl : "",
  _iImageCropped : 0,
  _iImageMarginTop : 0,
  _iScrollablePosition : undefined,
  _sFirstParagraph : "",
  _sMostReadParagraph : "",
  _lsAllParagraphs : "",
  _lParagraphs : [],
  _lCopyPaste : [],

  /**
   * @constructor
   */
  init : function() {
    this._iPercent = 0;
    this._fPageScore = 0;
    this._fTimeTabActive = -1;
    this._fTimeTabOpen = -1;
    this._lHighlightedText = [];
    this._sImageUrl = "";
    this._sFirstParagraph = "";
    this._sMostReadParagraph = "";
    this._lsAllParagraphs = "";
    this._lParagraphs = [];
    this._lCopyPaste = [];
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
  timeTabActive : function() {
    return this._fTimeTabActive;
  },
  setTimeTabActive : function(fTimeTabActive) {
    this._fTimeTabActive = fTimeTabActive || -1;
  },
  increaseTimeTabActive : function(fTimeTabActive) {
    this._fTimeTabActive += fTimeTabActive;
  },
  timeTabOpen : function() {
    return this._fTimeTabActive;
  },
  setTimeTabOpen : function(fTimeTabOpen) {
    this._fTimeTabOpen = fTimeTabOpen || -1;
  },
  increaseTimeTabOpen : function(fTimeTabOpen) {
    this._fTimeTabOpen += fTimeTabOpen;
  },
  firstParagraph : function() {
    return this._sFirstParagraph;
  },
  setFirstParagraph : function(sFirstParagraph) {
    this._sFirstParagraph = sFirstParagraph;
  },
  mostReadParagraph : function(){
    return this._sMostReadParagraph;
  },
  setMostReadParagraph : function(sMostReadParagraph){
    this._sMostReadParagraph = sMostReadParagraph;
  },

  paragraphs : function() {
    return this._lParagraphs;
  },
  addParagraph : function(oParagraph) {
    var self = this;
    var iIndexOfParagraph = _.indexOf(_.collect(self._lParagraphs,
                                  function(_oParagraph){
                                    return _oParagraph.id();
                                  }),
                                  oParagraph.id()
                        );
    // Add the score if it doesn't exists. If not set it.
    if(iIndexOfParagraph === -1){
      self._lParagraphs.push(oParagraph);
    } else {
      self._lParagraphs[iIndexOfParagraph] = oParagraph;
    }
  },
  setParagraphs : function(lParagraphs) {
    this._lParagraphs = lParagraphs;
  },
  allParagraphs : function() {
	return this._lsAllParagraphs;
  },
  setAllParagraphs : function(lsParagraphs) {
	this._lsAllParagraphs = lsParagraphs;
  },
  copyPaste : function() {
    return this._lCopyPaste;
  },
  setCopyPaste : function(lCopyPaste) {
    this._lCopyPaste = lCopyPaste;
  },
  addCopyPaste : function(sCopyPaste) {
    this._lCopyPaste.push(sCopyPaste);
  },

});
