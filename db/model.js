'use strict';

Cotton.Model.Base = Class.extend({

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
    return this._dDBRecord[sKey] || this._getDefault[sKey];
  },

  set: function(sKey, oValue){
    this._dDBRecord[sKey] = oValue;
  },

  /**
   * Return a dict that contains all the default values.
   * MANDATORY;
   */
  _default: function(){
    throw "Default is a mandatory function, need to be implemented in a model"
    // return {};
  },

  _getDefault: function(sKey){
    return this._default[sKey] || throw sKey + "is not expected in the model";
  }
});
