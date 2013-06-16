'use strict';

/**
 * Content Script Listener
 *
 * Instance host by background.html Listen all the messages send by content
 * scripts (i.e. scripts injected directly in the page.
 *
 * See below page for more informations.
 * http://code.google.com/chrome/extensions/messaging.html
 */

/**
 * onMessage : link with the chrome API method
 * chrome.runtime.onMessage.addListener
 *
 * Called when a message is passed by a content script.
 */
Cotton.Controllers.BackgroundListener = Class.extend({

  _oMessagingController : null,

  init: function(oMessagingController, oMainController){
    var self = this;
    self._oMessagingController = oMessagingController;
    self._oMainController = oMainController;

    // Listen all the messages sent to the background page.
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (!self._oMainController._bReadyForMessaging){
        // install is not finished, do nothing
      } else if (sender.tab.index === -1){
        // it is a page preloaded by google in a ghost tab
        // pass
      } else {
        DEBUG && console.debug(request);

        /**
         * DISPATCHER
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
              [sendResponse, request['params']['historyItem'],
              request['params']['contentSet'], sender]);
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

          case 'change_story':
            self._oMessagingController.doAction(request['action'],
              [sendResponse, request['params']['story_id']]);
            break;

          default:
            break;
        }

        return true;
      }
    });
  },

  // TODO(rmoutard) : add a system to subscribe to the dispatcher.
});
