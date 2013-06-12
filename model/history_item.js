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
      'sIitle': "", // {String} title: of the page.
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
  merged: function(dDBRecord1, dDBRecord2) {
    dItem = {};
    // Take the older lastVisitTime.
    dItem['iLastVisitTime'] = Math.max(dDBRecord1['iLastVisitTime'], dDBRecord2['iLastVisitTime']);
    //FIXME(rmoutard): not sure it's the right formula for iVisitCount.
    dItem['iVisitCount'] = Math.max(dDBRecord1['iVisitCount'], dDBRecord2['iVisitCount']);

              var lParagraphs = [];
          lParagraphs = lParagraphs.concat(dItem['oExtractedDNA']['lParagraphs']);
          for (var i = 0, dResultParagraph; dResultParagraph = oResult['oExtractedDNA']['lParagraphs'][i]; i++){
            var bMerge = false;
            for (var j = 0, dParagraph; dParagraph = dItem['oExtractedDNA']['lParagraphs'][j]; j++){
              if (dResultParagraph['id'] === dParagraph['id']){
                bMerge = true;
                dParagraph['fPercent'] = Math.max(dParagraph['fPercent'],dResultParagraph['fPercent']);
                var lQuotes = [];
                lQuotes = lQuotes.concat(dParagraph['lQuotes']);
                for (var k = 0, dResultQuote; dResultQuote = dResultParagraph['lQuotes'][k]; k++){
                  var bMergeQuote = false;
                  for (var l = 0, dQuote; dQuote = dParagraph['lQuotes'][l]; l++){
                    if ((dResultQuote['start']-dQuote['start'])*(dResultQuote['start']-dQuote['end']) <= 0
                      ||(dResultQuote['end']-dQuote['start'])*(dResultQuote['end']-dQuote['end']) <= 0
                      || (dResultQuote['start'] <= dQuote['start'] && dResultQuote['end'] >= dQuote['end'])){
                        bMergeQuote = true;
                        dQuote['start'] = Math.min(dQuote['start'], dResultQuote['start']);
                        dQuote['end'] = Math.max(dQuote['end'], dResultQuote['end']);
                      lQuotes[l] = dQuote;
                    }
                  }
                  if (!bMergeQuote){
                    lQuotes.push(dResultQuote);
                  }
                }
                lParagraphs[j]['lQuotes'] = lQuotes;
                break;
              }
            }
            if (!bMerge){
              lParagraphs.push(dResultParagraph);
            }
          }
          dItem['oExtractedDNA']['lParagraphs'] = _.sortBy(lParagraphs, function(dParagraph){
            return dParagraph['id'];
          });
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
