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
  // {Array.<Cotton.Model.ExtractedParagraph>} list of object.
  _lParagraphs : [],

  _default: function() {
    return {
      'lQueryWords':[],
      'sClosestGoogleSearchPage': "",
      'iPercent': 0, // Percentage of text read according to the visible part of the page.
      'fPageScore': 0,
      'fTimeTabActive': -1,
      'fTimeTabOpen': 0,
      'sImageUrl': "",
      'lParagraphs':[]
    };
  },

  init : function(dDBRecord) {
    this._super(dDBRecord);
    this._lParagraphs = [];
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
  addExtractedWordsToBagOfWords : function(lWords) {

    // Update the bag of words.
    for (var i = 0, iLength = lWords.length; i < iLength; i++) {
      var sWord = lWords[i];
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
    fTemp += fTimeTabActive;
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
    fTemp += fTimeTabOpen;
    this.set('fTimeTabOpen', fTemp);
  },
  firstParagraph : function() {
    if (this._lParagraphs.length > 0) return this._lParagraphs[0];
    else return undefined;
  },
  paragraphs : function() {
    return this._lParagraphs;
  },
  /**
   * If the paragraph already exists simply remove and replace, else just
   * add it to the list.
   */
  addParagraph : function(oParagraph) {
    for (var i = 0, _oParagraph; _oParagraph = this._lParagraphs[i]; i++) {
      if (_oParagraph.id() === oParagraph.id()) {
         this._lParagraph[i] = oParagraph;
         return;
      }
    }
    this._lParagraphs.push(oParagraph);
  },
  setParagraphs : function(lParagraphs) {
    this._lParagraphs = lParagraphs;
  },

  /**
   * When you have complexe things to do to deserialize, you can redifine
   * the dDBRecord function.
   */
  dbRecord: function() {
    var lTemp = [];
    for (var i = 0, oParagraph; oParagraph = this._lParagraphs[i]; i++) {
      lTemp.push(oParagraph.serialize());
    }
    this._dDBRecord['lParagraphs'] = lTemp;
    return this._dDBRecord;
  }

});
