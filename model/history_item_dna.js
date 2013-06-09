'use strict';

/**
 * ExtractedDNA
 *
 * This class is used to store all the relevent elements from a page. We extract
 * the DNA of the page, like score on each block, keywords, hightlight... That's
 * why it's called PageDNA.
 */

Cotton.Model.HistoryItemDNA = Cotton.DB.Model.extend({

  _sModelStore : 'historyItemDNA',
  _oBagOfWords : null,

  _default: function() {
    return {
      'lQueryWords':[],
      'lExtractedWords':[],
      'sClosestGoogleSearchPage': "",
      'iPercent': 0,
      'fPageScore': 0,
      'fTimeTabActive': -1,
      'lHighlightedText':[],
      'sImageUrl': "",
      'sFirstParagraph': "",
      'sMostReadParagraph':"",
      'lsAllParagraphs': [], //FIXME(rmoutard) : lParagraphs ans lAllParagraphs
      'lParagraphs':[],
      'lCopyPaste': []
    };
  },

  init : function(dDBRecord) {
    this._super(dDBRecord);
    var dBagOfWords = dDBRecord['dBagOfWords'] || {};
    this._oBagOfWords = new Cotton.Model.BagOfWords(dBagOfWords);
    this._dDBRecord['dBagOfWords'] = this._oBagOfWords.get();
  },
  queryWords : function() {
    return this.get('lQueryWords');
  },
  setQueryWords : function(lQueryWords) {
    this.set('lQueryWords', lQueryWords);
  },
  addQueryWord : function(sQueryWord) {
    var lTemp = this.get('lQueryWords');
    if (_.indexOf(lTemp, sQueryWord) === -1) {
      lTemp.push(sQueryWord);
      this.set('lQueryWords', lTemp);
    }
  },
  addListQueryWords : function(lQueryWords) {
    for (var i = 0, sWord; sWord = lQueryWords[i]; i++) {
      this.addQueryWord(sWord);
    }
  },
  setStrongQueryWords : function(lStrongQueryWords) {
    for (var i = 0, sQueryWord; sQueryWord = lStrongQueryWords[i]; i++) {
      this.addQueryWord(sQueryWord);
      this._oBagOfWords.addWord(sQueryWord,
        Cotton.Config.Parameters.scoreForStrongQueryWords);
    }
  },
  setWeakQueryWords : function(lWeakQueryWords) {
    for (var i = 0, sQueryWord; sQueryWord = lWeakQueryWords[i]; i++) {
      this.addQueryWord(sQueryWord);
      //FIXME(rmoutard): ask to rkorach why there is this < 3.
      if (this._oBagOfWords.size() < 3) {
        this._oBagOfWords.addWord(sQueryWord,
          Cotton.Config.Parameters.scoreForWeakQueryWords);
      }
    }
  },

  //FIXME(rmoutard): What is it ?
  setMinWeightForWord : function() {
    if (this._oBagOfWords.size() <= 1) {
      //FIXME(rkorach): do not use for in.
      for (var sWord in this._oBagOfWords.get()) {
        this._oBagOfWords.addWord(sWord, Cotton.Config.Parameters.scoreForSoleWord);
      }
    }
  },
  extractedWords : function(){
    return this.get('lExtractedWords');
  },
  setExtractedWords : function(lExtractedWords) {
    // Set the value in dbRecord.
    this.set('lExtractedWords', lExtractedWords);

    // Update the bag of words.
    for (var i = 0, iLength = lExtractedWords.length; i < iLength; i++) {
      var sWord = lExtractedWords[i];
      this._oBagOfWords.addWord(sWord,
        Cotton.Config.Parameters.scoreForExtractedWords);
    }
  },
  bagOfWords : function() {
    return this._oBagOfWords;
  },
  setBagOfWords : function(oBagOfWords) {
    this._oBagOfWords = oBagOfWords;
  },
  closestGoogleSearchPage : function() {
    return this.get('sClosestGoogleSearchPage', sClosestGoogleSearchPage);
  },
  setClosestGoogleSearchPage : function(sClosestGoogleSearchPage) {
    this.set('sClosestGoogleSearchPage', sClosestGoogleSearchPage);
  },
  highlightedText : function() {
    return this.get('lHighlightedText');
  },
  addHighlightedText : function(sText) {
    //TODO(rmoutard): I think there is no need for a temp variable.
    // this.get('lHighlightedText').push(sText);
    var lTemp = this.get('lHighlightedText');
    lTemp.push(sText);
    this.set('lHighlightedText', lTemp);
  },
  setHighlightedText : function(lHighlightedText) {
    this.set('lHighlightedText', lHighlightedText);
  },
  imageUrl : function() {
    return this.get('sImageUrl');
  },
  setImageUrl : function(sImageUrl) {
    this.set('sImageUrl', sImageUrl);
  },
  percent : function() {
    return this.get('iPercent');
  },
  setPercent : function(iPercent) {
    this.set('iPercent', iPercent);
  },
  pageScore : function() {
    return this.get('fPageScore');
  },
  setPageScore : function(fPageScore) {
    this.set('fPageScore', fPageScore);
  },
  timeTabActive : function() {
    return this.get('fTimeTabActive');
  },
  setTimeTabActive : function(fTimeTabActive) {
    this.set('fTimeTabActive', fTimeTabActive);
  },
  increaseTimeTabActive : function(fTimeTabActive) {
    var fTemp = this.get('fTimeTabActive');
    this.set('fTimeTabActive', fTemp);
  },
  timeTabOpen : function() {
    return this.get('fTimeTabOpen');
  },
  setTimeTabOpen : function(fTimeTabOpen) {
    this.set('fTimeTabOpen', fTimeTabOpen);
  },
  increaseTimeTabOpen : function(fTimeTabOpen) {
    var fTemp = this.get('fTimeTabOpen');
    this.set('fTimeTabOpen', fTemp);
  },
  firstParagraph : function() {
    return this.get('sFirstParagraph');
  },
  setFirstParagraph : function(sFirstParagraph) {
    this.set('sFirstParagraph', sFirstParagraph);
  },
  mostReadParagraph : function() {
    return this.get('sMostReadParagraph');
  },
  setMostReadParagraph : function(sMostReadParagraph){
    this.set('sMostReadParagraph', sMostReadParagraph);
  },

  paragraphs : function() {
    return this.get('lParagraphs');
  },
  addParagraph : function(oParagraph) {
    var lTemp = this.get('lParagraphs');
    //FIXME(rmoutard): collect has desepear from backbone.js
    var iIndexOfParagraph = _.indexOf(
      _.collect(lTemp, function(_oParagraph) {
        return _oParagraph.id();
    }), oParagraph.id());
    // Add the score if it doesn't exists. If not set it.
    if(iIndexOfParagraph === -1){
      lTemp.push(oParagraph);
    } else {
      lTemp[iIndexOfParagraph] = oParagraph;
    }
    this.set('lParagraphs', lTemp);
  },
  setParagraphs : function(lParagraphs) {
    this.set('lParagraphs', lParagraphs);
  },
  allParagraphs : function() {
	return this.get('lsAllParagraphs');
  },
  setAllParagraphs : function(lsParagraphs) {
	this.set('lsAllParagraphs', lsParagraphs);
  },
  copyPaste : function() {
    return this.get('lCopyPaste');
  },
  setCopyPaste : function(lCopyPaste) {
    this.set('lCopyPaste', lCopyPaste);
  },
  addCopyPaste : function(sCopyPaste) {
    var lTemp = this.get('sCopyPaste', sCopyPaste);
    lTemp.push(sCopyPaste);
    this.set('sCopyPaste', sCopyPaste);
  }

});
