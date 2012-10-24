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
  _fPercent : 0,
  _sText : "",

  init : function(sText){
    var self = this;
    self._sText = sText;
  },

  id : function(){
    return this._iId;
  },
  setId : function(iId){
    this._iId = iId;
  },
  text : function(){
    return this._stext;
  },
  setText : function(sText){
    this._stext = sText;
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

  serialize : function(){
    var self = this;
    var dDBRecord = {
      'id' : self._iId,
      'fPercent' : self._fPercent,
      'sText' : self._sText,
    };

    return dDBRecord;
  },

});
