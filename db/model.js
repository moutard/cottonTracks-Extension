'use strict';

Cotton.DB.Model = Class.extend({

  _sModelStore: undefined,
  _dModelIndexes: undefined,
  _dDBRecord: null, // dictionnary stored that can be stored directly in the database.

  /**
   * Create a model from a dDBRecord.
   */
  init: function(dDBRecord){
    this._dDBRecord = dDBRecord;
  },

  dbRecord: function(){
    return this._dDBRecord;
  },

  get: function(sKey){
    return this._dDBRecord[sKey] || this._default()[sKey];
  },

  set: function(sKey, oValue){
    this._dDBRecord[sKey] = oValue;
  },

  push: function(sKey, oValue){
    this._dDBRecord[sKey].push(oValue);
  },

  /**
   * Return a dict that contains all the default values.
   * MANDATORY;
   */
  _default: function(){
    throw "Default is a mandatory function, need to be implemented in a model"
    // return {};
  }

});
