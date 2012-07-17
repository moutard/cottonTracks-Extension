'use strict';

/**
 * Tool
 * a Tool is webpage that provides you a service.
 * As mail.google.com, www.youtube.com,
 * they can be identified by their hostname
 */
Cotton.Model.Tool = Class.extend({

  _sId : undefined,
  _sHostname : undefined,
  _fFrequency : 0,

  /**
  * @constructor
  */
  init : function(psHostname, pfFrequency) {

    this._sHostname = psHostname;
    this._fFrequency = pfFrequency;
  },
});
