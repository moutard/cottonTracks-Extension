'use strict';
/**
 * A dispacher can be used to communicate betwween different part of the code.
 * You just need to pass the dispacher to the object, and suscribe the
 * object to you message.
 */
Cotton.Messaging.Dispacher = Class.extend({
  /**
   * list all the object that listen messages from the dispacher.
   * {Dictionary} :
   *  key: sMessage name of the message.
   *  value : list of listeners for this message.
   */
  _dMessages : {},

  init : function() {
    this._dMessages = {};
  },

  /**
   * object that what to suscribe to the dispacher.
   */
  suscribe : function(sMessage, oObject, mFunction) {
    var lMessageListeners = this._dMessages[sMessage] || [];
    lMessageListeners.push({
      'context' : oObject,
      'function': mFunction
    });
    this._dMessages[sMessage] = lMessageListeners;
  },

  send : function(sMessage, dArguments) {
    var lListeners = this._dMessages[sMessage] || [];
    for (var i=0, oListener; oListener = lListeners[i]; i++) {
      oListener['function'].call(oListener['context'], dArguments);
    }
  }

});
