'use strict';

/**
 * Client in charge of sending message through chrome api.
 */
Cotton.Core.Messenger = Class.extend({

  _lActionsListened : [],

  init : function() {
    this._lActionsListened = [];
  },

  /**
   * Bind the chrome onMessage listener.
   */
  listen : function(sAction, mCallback) {
    this._lActionsListened.push(sAction);
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if(sAction === request['action'] || sAction === '*'){
        return mCallback(request, sender, sendResponse);
      }
    });
  },

  /**
   * Bind the chrome sendMessage function.
   */
  sendMessage : function(dMessage, mCallback) {
    if (mCallback){
      chrome.runtime.sendMessage(dMessage, mCallback);
    } else {
    chrome.runtime.sendMessage(dMessage);
    }
  }

});