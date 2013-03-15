'use strict';

/**
 * ExtractedDNA
 *
 * This class is used to store all the relevent elements from a page. We extract
 * the DNA of the page, like score on each block, keywords, hightlight... That's
 * why it's called PageDNA. The extractedDNA depends on the visit.
 */

Cotton.Model.ExtractedDNA = Class.extend({

  _lQueryWords : [],                  // words used to make the google search.
  _lExtractedWords : [],              // words extracted from title and content.
  _sClosestGeneratedPage : undefined, // closest google search page.

  _iPercent : 0,
  _fPageScore : 0,
  _fTimeTabActive : -1,               // time the tab was active.
  _fTimeTabOpen : -1,
  _lHighlightedText : [],
  _sImageUrl : "",
  _sFirstParagraph : "",
  _sMostReadParagraph : "",
  _lsAllParagraphs : "",
  _lParagraphs : [],
  _lCopyPaste : [],

  /**
   * @constructor
   */
  init : function() {
  },
  queryWords : function() {
    return this._lQueryWords;
  },
  setQueryWords : function(lQueryWords) {
    this._lQueryWords = lQueryWords;
  },
  extractedWords : function() {
    return this._lExtractedWords;
  },
  setExtractedWords : function(lExtractedWords) {
    this._lExtractedWords = lExtractedWords;
  },
  closestGeneratedPage : function() {
    return this._sClosestGeneratedPage;
  },
  setClosestGeneratedPage : function(sClosestGeneratedPage) {
    this._sClosestGeneratedPage = sClosestGeneratedPage;
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
