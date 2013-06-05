'use strict';

/**
 * Client in charge of sending message through chrome api.
 */
Cotton.Core.Sender = Class.extend({

  init : function() {

  },

  /**
   * Bind the chrome send message function.
   */
  sendMessage : function(dMessage, mCallback) {
    chrome.extension.sendMessage(dMessage, mCallback);
  }

});
