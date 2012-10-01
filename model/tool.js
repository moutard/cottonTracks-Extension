'use strict';

/**
 * Tool
 * a Tool is webpage that provides you a service.
 * As mail.google.com, www.youtube.com,
 * they can be identified by their hostname.
 *
 * All https:// are considered as tools.
 */
Cotton.Model.Tool = Class.extend({

  _sId : undefined,
  _sHostname : undefined,
  _fFrequency : 0,

  /**
  * @constructor
  */
  init : function(sHostname, fFrequency) {

    this._sHostname = sHostname;
    this._fFrequency = fFrequency;
  },

  hostname : function(){
    return this._sHostname;
  },

  frequency : function(){
    return this._fFrequency;
  },

  setFrequency : function(fFrequency){
    this._fFrequency = fFrequency;
  },

  increaseFrequency : function(){
    this._fFrequency+=1;
  },
});
