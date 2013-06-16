'use strict';

/**
 * Client in charge of sending message through chrome api.
 */
Cotton.Core.Listener = Class.extend({

  _ActionsListened : [],

  init : function() {
    this._ActionsListened = [];
  },

  listen : function(sAction, mCallback) {
    this._ActionsListened.push(sAction);
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if(request['action'] === sAction){
        mCallback(request, sender, sendResponse);
      }
    }
  },

});
