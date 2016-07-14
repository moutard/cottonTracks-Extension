'use strict';
/**
 * A dispatcher can be used to communicate between different part of the code.
 * You just need to pass the dispatcher to the object, and subscribe the
 * object to you message.
 */
Cotton.Messaging.Dispatcher = Class.extend({
  /**
   * list all the object that listen messages from the dispatcher.
   * {Dictionary} :
   *  key: sMessage name of the message.
   *  value : list of listeners for this message.
   */
  _dMessages : {},

  init : function() {
    var self = this;
    this._dMessages = {};
  },

  /**
   * object that what to subscribe to the dispatcher.
   */
  subscribe : function(sMessage, oObject, mFunction) {
    var lMessageListeners = this._dMessages[sMessage] || [];
    lMessageListeners.push({
      'context' : oObject,
      'function': mFunction
    });
    this._dMessages[sMessage] = lMessageListeners;
  },

  publish : function(sMessage, dArguments) {
    var lListeners = this._dMessages[sMessage] || [];
    var iLength = lListeners.length;
    for (var i=0; i < iLength; i++) {
      // we put this condition because there is a chance that the first
      // listener purges a second one, for which the reference is now null
      // and there is no 'function' that we can call.
      // hence an error is thrown.
      var oListener = lListeners[i];
      if (oListener['context'] && oListener['function']) {
        oListener['function'].call(oListener['context'], dArguments);
      }
    }
  },

  /**
   * Unsuscribe a object for a given message.
   */
  unsubscribe : function(sMessage, oObject) {
    // If the message exists.
    if (this._dMessages[sMessage]) {
      // Recompute the list of listener removing the current object.
      var lMessageListeners = [];
      var iLength = this._dMessages[sMessage].length;
      for (var i = 0; i < iLength; i++) {
        var dListener = this._dMessages[sMessage][i];
        if (dListener['context'] !== oObject) {
          lMessageListeners.push({
            'context': dListener['context'],
            'function': dListener['function']
          });
        } else {
          // Make sure to nullify the reference to the object and the function,
          // to avoid memory leak.
          dListener['context'] = null;
          dListener['function'] = null;
        }
      }
      this._dMessages[sMessage] = lMessageListeners;
    }
  }

});
