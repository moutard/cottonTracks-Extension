'use strict';

/**
 * ExtractedDNA
 *
 * This class is used to store all the relevent elements from a page. We extract
 * the DNA of the page, like score on each block, keywords, hightlight... That's
 * why it's called PageDNA.
 */

Cotton.Model.HistoryItemDNA = Cotton.DB.Model.extend({

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

  _default: function(){
    return {
      'lQueryWords':[],
      'lExtractedWords':[],
      'sClosestGoogleSearchPage': "",
      'oBagOfWords': undefined,
      'iPercent': 0,
      'fPageScore': 0,
      'fTimeTabActive': -1,
      'lHighlightedText':[],
      'sImageUrl': "",
      'sFirstParagraph': "",
      'sMostReadParagraph':"",
      'lsAllParagraphs': [],
      'lParagraphs':[],
      'lCopyPaste': []
    };
  },

  init : function(dDBRecord) {
    this._super(dDBRecord);
    this._oBagOfWords = new Cotton.Model.BagOfWords(dDBRecord['oBagOfWords']);
  },
  queryWords : function() {
    return this._lQueryWords;
  },
  addQueryWord : function(sQueryWord){
    if (this._lQueryWords.indexOf(sQueryWord) === -1){
      this._lQueryWords.push(sQueryWord);
    }
  },
  addListQueryWords : function(lQueryWords){
    for (var i = 0, sWord; sWord = lQueryWords[i]; i++){
      this.addQueryWord(sWord);
    }
  },
  setQueryWords : function(lQueryWords) {
    var self = this;
    this._lQueryWords = lQueryWords;
  },
  setStrongQueryWords : function(lStrongQueryWords) {
    var self = this;
    for (var i = 0, sQueryWord; sQueryWord = lStrongQueryWords[i]; i++) {
      this.addQueryWord(sQueryWord)
      self._oBagOfWords.addWord(sQueryWord,
        Cotton.Config.Parameters.scoreForStrongQueryWords);
    }
  },
  setWeakQueryWords : function(lWeakQueryWords) {
    var self = this;
    for (var i = 0, sQueryWord; sQueryWord = lWeakQueryWords[i]; i++) {
      this.addQueryWord(sQueryWord);
      if (this._oBagOfWords.size() < 3){
        self._oBagOfWords.addWord(sQueryWord,
          Cotton.Config.Parameters.scoreForWeakQueryWords);
      }
    }
  },
  setMinWeightForWord : function(){
    if (this._oBagOfWords.size() <= 1){
      for (var sWord in this._oBagOfWords.get()){
        this._oBagOfWords.addWord(sWord, Cotton.Config.Parameters.scoreForSoleWord);
      }
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
      self._oBagOfWords.addWord(sWord,
        Cotton.Config.Parameters.scoreForExtractedWords);
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
