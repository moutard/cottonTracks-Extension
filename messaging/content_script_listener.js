'use strict';

/**
 * Content Script Listener
 *
 * Instance host by background.html Listen all the messages send by content
 * scripts (i.e. scritps injected directly in the page.
 *
 * See below page for more informations.
 * http://code.google.com/chrome/extensions/messaging.html
 */

/**
 * onRequest : link with the chrome API method
 * chrome.extension.onRequest.addListener
 *
 * Called when a message is passed by a content script.
 */
Cotton.Controllers.ContentScriptListener = Class.extend({

  _oMessagingController : null,

  init: function(oMessagingController){
    var self = this;
    self._oMessagingController = oMessagingController;

    // Listen for the content script to send a message to the background page.
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

      DEBUG && console.debug(request);

      /**
       * DISPACHER
       * All the message send by sendMessage arrived here.
       * CottonTracks defined an "action" parameters.
       * - create_history_item
       * - import_history
       */
    if (request['params'] && request['params']['historyItem']) {
      self._oMessagingController.doAction(request['action'], [sendResponse,
        request['params']['historyItem']]);
      // need to add sendResponse as an argument because it's only defined in
      // addListener functions.
      return true;
    }
    });
  },

  // TODO(rmoutard) : add a system to suscribe to the dispacher.
});