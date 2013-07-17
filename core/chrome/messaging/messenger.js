'use strict';

/**
 * Client in charge of sending message through chrome api.
 */
Cotton.Core.Messenger = Class.extend({

  _lActionsListened : [],

  /**
   * Older version of chromium uses chrome.extension.sendMessage
   * new version (>25) of chromium uses chrome.runtime.sendMessage
   * (still supports chrome.extension for the moment,
   * but it is not recommended for when it will drop it!)
   * some browsers based on chromium only support chrome.extension,
   * so we make a test then use the correct api.
   **/
  _oMessengerApi : null,

  init : function() {
    this._lActionsListened = [];
    this._oMessengerApi = (chrome.runtime && chrome.runtime.onMessage) ? chrome.runtime : chrome.extension;
  },

  /**
   * Bind the chrome onMessage listener.
   */
  listen : function(sAction, mCallback) {
    this._lActionsListened.push(sAction);
    this._oMessengerApi.onMessage.addListener(function(request, sender, sendResponse) {
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
      this._oMessengerApi.sendMessage(dMessage, mCallback);
    } else {
      this._oMessengerApi.sendMessage(dMessage);
    }
  }

});