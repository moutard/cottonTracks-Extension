'use strict';

/**
 * HistoryItem
 *
 * Model.
 * Every visit on a page corresponds to a historyItem. If you visit the same
 * page twice but at a different moment you have the same historyItem.
 */

var dHistoryItemIndexes = {
  'id' : {
    'unique' : true
  },
  'sUrl' : {
    'unique' : true
  },
  'iLastVisitTime' : {
    'unique' : false
  },
  'iStoryId' : {
    'unique' : false
  }
};

Cotton.Model.HistoryItem = Cotton.DB.Model.extend({

  _sModelStore: "historyItems",
  _oExtractedDNA : undefined, // dna of the page. Used to compute distance.
  _dModelIndexes: dHistoryItemIndexes,
  _default: function(){
    return {
      'id': undefined, // {Int} id: of the historyItem in the cotton database.
      'sUrl': undefined, // {String} url: of the page.
      'sTitle': "", // {String} title: of the page.
      'iLastVisitTime': undefined, // {Int} last time we visit this page.
      'iVisitCount': 1, // {Int} number of time we visit this page.
      'iStoryId': -1, // {Int} if is in a story, id of this story, -1 means UNCLASSIFIED.
    };
  },

  /**
   * {Dictionnary} dDBRecord :
   *  dict that contains all the variables like they are stored in the
   *  database.
   */
  init : function(dDBRecord) {
    this._super(dDBRecord);
    var dExtractedDNA = dDBRecord['oExtractedDNA'] || {};
    this._oExtractedDNA = new Cotton.Model.HistoryItemDNA(dExtractedDNA);
    this._dDBRecord['oExtractedDNA'] = this._oExtractedDNA.dbRecord();
  },
  // can't be set
  id : function() {
    return this.get('id');
  },
  initId : function(iId) {
    if(this.get('id') === undefined){this.set('id', iId);}
  },
  url : function() {
    return this.get('sUrl');
  },
  initUrl : function(sUrl) {
    if(this.get('sUrl') === undefined){this.set('sUrl', sUrl);}
  },
  title : function() {
    return this.get('sTitle');
  },
  setTitle : function(sTitle) {
    this.set('sTitle', sTitle);
  },
  lastVisitTime : function() {
    return this.get('iLastVisitTime');
  },
  setLastVisitTime : function(iLastVisitTime) {
    this.set('iLastVisitTime', iLastVisitTime);
  },
  visitCount : function() {
    return this.get('iVisitCount');
  },
  setVisitCount : function(iVisitCount) {
    this.set('iVisitCount', iVisitCount);
  },
  incrementVisitCount : function(iVisitsAdded) {
    var iTemp = this.get('iVisitsAdded');
    if (iVisitsAdded) {
      iTemp += iVisitsAdded;
    } else {
      iTemp ++;
    }
    this.set('iVisitsAdded', iTemp);
  },
  storyId : function() {
    return this.get('iStoryId');
  },
  setStoryId : function(iStoryId) {
    this.set('iStoryId', iStoryId);
  },
  extractedDNA : function() {
    return this._oExtractedDNA;
  },
  setExtractedDNA : function(oExtractedDNA) {
    this._oExtractedDNA = oExtractedDNA;
  },
  searchKeywords : function() {
    return this.get('sTitle').toLowerCase().split(" ");
  },
  oUrl : function() {
    if(!this._oUrl) {
      this._oUrl = new UrlParser(this.get('sUrl'));
    }
    return this._oUrl;
  },
  /**
   * We assume that dDBRecord1 is the oldest so the one who was in the database.
   * FIXME(rmoutard): I think for this specific case the merge function is really
   * unefficient. I think:
   * in the parser we get the element from sUrl. If there is not we create a new
   * one, if not we return it, and we update directly the js object.
   * and then instead of using putUnique we use put that remove and replace
   * the old version.
   */
  merged: function(dDBRecord1, dDBRecord2) {
    dItem = {};
    // Take the older lastVisitTime.
    dItem['iLastVisitTime'] = Math.max(dDBRecord1['iLastVisitTime'], dDBRecord2['iLastVisitTime']);
    //FIXME(rmoutard): not sure it's the right formula for iVisitCount.
    dItem['iVisitCount'] = Math.max(dDBRecord1['iVisitCount'], dDBRecord2['iVisitCount']);

    var lParagraphs1 = dDBRecord1['oExtractedDNA']['lParagraphs'];
    var lParagraphs2 = dDBRecord2['oExtractedDNA']['lParagraphs'];

    // A dictionnary should be definitively more efficient here.
    // For each paragraph in lParagraphs2 find it in lParagraphs1 (using id or position.)
    for (var i = 0, dParagraph2; dParagraph2 = lParagraphs2[i]; i++) {

      // Find the corresponding paragraphs using id, do not use _.find.
      var iIndex = -1;
      for (var j = 0, dParagraph1; dParagraph1 = lParagraphs1[j]; j++) {
        if (dParagraph1['id'] === dParagraph2['id']) {
          iIndex = j;
        }
        if (iIndex !== -1) {
          // If the paragraphs exists in the old version, update it else add it.
          // Take the max of fPercent.
          lParagraphs1[iIndex]['fPercent'] = Math.max(
              lParagraphs1[iIndex]['fPercent'],
              lParagraphs2[iIndex]['fPercent']);

          // Add quotes.
          // FIXME(rmoutard): due to performance issue I simplified the code
          // here, but we can do better to handle quotes.
          lParagraphs1[iIndex]['lQuotes'].concat(lParagraphs2[iIndex]['lQuotes']);
        } else {
          // Simply add the paragraph
          lParagraphs1.push(dParagraph2);

        }
      }
    }

    //
    dItem['oExtractedDNA']['lQueryWords'] = oResult['oExtractedDNA']['lQueryWords'];

    // Take the max value of each key.
    var dTempBag = {};
    for (var sWord in dItem['oExtractedDNA']['dBagOfWords']){
      var a = dItem['oExtractedDNA']['dBagOfWords'][sWord] || 0;
      var b = oResult['oExtractedDNA']['dBagOfWords'][sWord] || 0;
      dTempBag[sWord] = Math.max(a,b);
    }
    dItem['oExtractedDNA']['dBagOfWords'] = dTempBag;
  }

});
