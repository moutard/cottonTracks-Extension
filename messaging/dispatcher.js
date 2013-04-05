'use strict';
/**
 * A dispatcher can be used to communicate betwween different part of the code.
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

    // Message listening from background page for getContent
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
      if (request['action'] === 'refresh_item'){
        self.publish('refresh_item', {'id': request['params']['itemId']});
      }
    });
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
    for (var i=0, oListener; oListener = lListeners[i]; i++) {
      oListener['function'].call(oListener['context'], dArguments);
    }
  }

});
