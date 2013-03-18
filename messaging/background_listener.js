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
Cotton.Controllers.BackgroundListener = Class.extend({

  _oMessagingController : null,

  init: function(oMessagingController){
    var self = this;
    self._oMessagingController = oMessagingController;

    // Listen all the messages sent to the background page.
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

      DEBUG && console.debug(request);

      /**
       * DISPACHER
       * All the message send by sendMessage arrived here.
       * CottonTracks defined an "action" parameters it's mandatory.
       */
      switch(request['action']) {

        case 'create_history_item':
          self._oMessagingController.doAction(request['action'],
            [sendResponse, request['params']['historyItem'], sender]);
          break;

        case 'update_history_item':
            self._oMessagingController.doAction(request['action'],
            [sendResponse, request['params']['historyItem'], sender]);
          break;

        case 'get_content_tab':
          self._oMessagingController.doAction(request['action'],
            [sendResponse, request['params']['tab_id']]);
          break;

        case 'get_trigger_story':
          self._oMessagingController.doAction(request['action'], [sendResponse]);
          break;

        case 'pass_background_screenshot':
          self._oMessagingController.doAction(request['action'], [sendResponse]);
          break;

        default:
          throw "BackgroundMessager received a message with an undefined or unknown 'action' parameter."
          break;
      }

      return true;
    });
  },

  // TODO(rmoutard) : add a system to suscribe to the dispacher.
});
