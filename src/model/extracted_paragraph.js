'use strict';

/**
 * ExtractedParagraph
 *
 * During reading rater each block receive a score, corresponding to the level
 * of reading. The problem is we don't want to store the block as an HTML
 * element. This model is more link with the database.
 *
 * TODO(rmoutard) : we can imagine some ceontent functions like the most
 * frequent words etc..
 */

Cotton.Model.ExtractedParagraph = Class.extend({

  _iId : undefined, // The id corresponds to the position of the paragraph
  _fPercent : undefined,
  _sText : null,
  _lQuotes : null,

  init : function(sText, lQuotes){
    var self = this;
    self._sText = sText;
    self._fPercent = 0;
    self._lQuotes = lQuotes || [];
  },

  id : function(){
    return this._iId;
  },
  setId : function(iId){
    this._iId = iId;
  },
  text : function(){
    return this._sText;
  },
  setText : function(sText){
    this._sText = sText;
  },
  percent : function(){
    return this._fPercent;
  },
  setPercent : function(fPercent){
    this._fPercent = fPercent;
  },
  increasePercent : function(fAddPercent){
    this._fPercent += fAddPercent;
  },
  quotes : function() {
    return this._lQuotes;
  },
  setQuotes : function(lQuotes) {
     this._lQuotes = lQuotes;
  },

  serialize : function(){
    var self = this;
    var dDBRecord = {
      'id' : self._iId,
      'fPercent' : self._fPercent,
      'sText' : self._sText,
      'lQuotes': self._lQuotes
    };

    return dDBRecord;
  },

  deserialize : function(dDBRecord){
    this._iId = dDBRecord['id'];
    this._fPercent = dDBRecord['fPercent'];
    this._sText = dDBRecord['sText'];
    this._lQuotes = dDBRecord['lQuotes'] || [];
  },

});
