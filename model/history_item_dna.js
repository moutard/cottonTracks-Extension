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
  _sClosestGoogleSearchPage : undefined,   // closest google search page.
  _oBagOfWords : null,

  _iPercent : undefined,
  _fPageScore : undefined,
  _fTimeTabActive : undefined,          // time the tab was active.
  _fTimeTabOpen : undefined,
  _sImageUrl : undefined,
  _lParagraphs : null,
  _sDescription : null,
  _lCopyPaste : null,

  /**
   *
   */
  init : function(dDBRecord) {
    //FIXME(rmoutard) : for the moment the bag of words is only synchronized
    // with extractedWords and QueryWords. Made something better.
    // Maybe remove QueryKeywords become redondant.

    dDBRecord = dDBRecord || {};

    this._lQueryWords = dDBRecord['lQueryWords'] || [];
    this._iPercent = 0;
    this._fTimeTabActive = -1;
    this._sImageUrl = dDBRecord['sImageUrl'] || "";

    this._lParagraphs = [];
    if (dDBRecord['lParagraphs']) {
      var iLength = dDBRecord['lParagraphs'].length;
      for (var i = 0; i < iLength; i++) {
        var oParagraph = new Cotton.Model.ExtractedParagraph();
        oParagraph.deserialize(dDBRecord['lParagraphs'][i]);
        this._lParagraphs.push(oParagraph);
      }
    }

    this._sDescription = dDBRecord['sImageUrl'] || "";
    this._lCopyPaste = dDBRecord['lCopyPaste'] || [];

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
    var iLength = lQueryWords.length;
    for (var i = 0; i < iLength; i++){
      var sWord = lQueryWords[i];
      this.addQueryWord(sWord);
    }
  },
  setQueryWords : function(lQueryWords) {
    var self = this;
    this._lQueryWords = lQueryWords;
  },
  setStrongQueryWords : function(lStrongQueryWords) {
    var self = this;
    var iLength = lStrongQueryWords.length;
    for (var i = 0; i < iLength; i++) {
      var sQueryWord = lStrongQueryWords[i];
      this.addQueryWord(sQueryWord)
      self._oBagOfWords.addWord(sQueryWord,
        Cotton.Config.Parameters.scoreForStrongQueryWords);
    }
  },
  setWeakQueryWords : function(lWeakQueryWords) {
    var self = this;
    var iLength = lWeakQueryWords.length;
    for (var i = 0; i < iLength; i++) {
      var sQueryWord = lWeakQueryWords[i];
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
  bagOfWords : function(){
    return this._oBagOfWords;
  },
  setBagOfWords : function(oBagOfWords){
    this._oBagOfWords = oBagOfWords;
  },
  addListToBagOfWords : function(lWords) {
    var iLength = lWords.length;
    for (var i = 0; i < iLength; i++) {
      this._oBagOfWords.addWord(lWords[i],
        Cotton.Config.Parameters.scoreForExtractedWords);
    }
  },
  closestGoogleSearchPage : function() {
    return this._sClosestGoogleSearchPage;
  },
  setClosestGoogleSearchPage : function(sClosestGoogleSearchPage) {
    this._sClosestGoogleSearchPage = sClosestGoogleSearchPage;
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
    return this._lParagraphs[0];
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
  description : function() {
    return this._sDescription;
  },
  setDescription : function(sDescription) {
    this._sDescription = sDescription;
  }

});
