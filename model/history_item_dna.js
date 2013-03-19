'use strict';

/**
 * ExtractedDNA
 *
 * This class is used to store all the relevent elements from a page. We extract
 * the DNA of the page, like score on each block, keywords, hightlight... That's
 * why it's called PageDNA.
 */

Cotton.Model.HistoryItemDNA = Class.extend({

  _lQueryWords : null,                  // words used to make the google search.
  _lExtractedWords : null,              // words extracted from title and content.
  _sClosestGoogleSearchPage : undefined,   // closest google search page.
  _oBagOfWords : null,

  _iPercent : undefined,
  _fPageScore : undefined,
  _fTimeTabActive : undefined,          // time the tab was active.
  _fTimeTabOpen : undefined,
  _lHighlightedText : null,
  _sImageUrl : undefined,
  _sFirstParagraph : undefined,
  _sMostReadParagraph : undefined,
  _lsAllParagraphs : undefined,
  _lParagraphs : null,
  _lCopyPaste : null,

  /**
   * @constructor
   */
  init : function(dDBRecord) {
    //FIXME(rmoutard) : for the moment the bag of words is only synchronized
    // with extractedWords and QueryWords. Made something better.
    // Maybe remove lExtractedKeywords and QueryKeywords become redondant.

    dDBRecord = dDBRecord || {};

    this._lQueryWords = dDBRecord['lQueryWords'] || [];
    this._lExtractedWords = dDBRecord['lQueryWords'] || [];

    this._iPercent = 0;
    this._fTimeTabActive = -1;
    this._lHighlightedText = dDBRecord['lHighlightedText'] || [];
    this._sImageUrl = dDBRecord['sImageUrl'] || "";
    this._sFirstParagraph = dDBRecord['sFirstParagraph'] || "";
    this._sMostReadParagraph = "";
    this._lsAllParagraphs = "";
    this._lParagraphs = [];
    this._lCopyPaste = dDBRecord['lCopyPaste'] || [];

    this._oBagOfWords = new Cotton.Model.BagOfWords(dDBRecord['oBagOfWords']);
  },
  queryWords : function() {
    return this._lQueryWords;
  },
  setQueryWords : function(lQueryWords) {
    var self = this;
    this._lQueryWords = lQueryWords;
    // Initialize the bag of words, with QueryWords and ExtractedWords.
    for (var i = 0, iLength = self._lQueryWords.length; i < iLength; i++) {
      var sWord = self._lQueryWords[i];
      self._oBagOfWords.addWord(sWord, 5);
    }
  },
  extractedWords : function() {
    return this._lExtractedWords;
  },
  setExtractedWords : function(lExtractedWords) {
    var self = this;
    self._lExtractedWords = lExtractedWords;
    for (var i = 0, iLength = self._lExtractedWords.length; i < iLength; i++) {
      var sWord = self._lExtractedWords[i];
      self._oBagOfWords.addWord(sWord, 3);
    }
  },
  bagOfWords : function(){
    return this._oBagOfWords;
  },
  setBagOfWords : function(oBagOfWords){
    this._oBagOfWords = oBagOfWords;
  },
  closestGoogleSearchPage : function() {
    return this._sClosestGoogleSearchPage;
  },
  setClosestGoogleSearchPage : function(sClosestGoogleSearchPage) {
    this._sClosestGoogleSearchPage = sClosestGoogleSearchPage;
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
