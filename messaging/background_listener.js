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
 * now placed in Core
 *
 * Called when a message is passed by a content script.
 */
Cotton.Controllers.BackgroundListener = Class.extend({

  _bIsStarted: false,
  _oMessagingController : null,

  init: function(oMessagingController, oMainController){
    var self = this;
    self._oMessagingController = oMessagingController;
    self._oMainController = oMainController;

    // Listen all the messages sent to the background page.
    self._oMainController._oMessenger.listen('*', function(request, sender, sendResponse) {
      if (!self._bIsStarted) {
        // install is not finished, do nothing
        sendResponse({'status': 'not started'});
      } else if (sender.tab.index === -1) {
        // it is a page preloaded by google in a ghost tab pass
        // FIXME(rmoutard->rkorach): do we really need to send a message back ?
        sendResponse({'ghost':true});
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
              [sendResponse, request['params']['historyItem']]);
            break;

          case 'update_history_item':
              self._oMessagingController.doAction(request['action'],
              [sendResponse, request['params']['historyItem']]);
            break;

          case 'switch_to_proto':
              self._oMessagingController.doAction(request['action'], [sendResponse]);
            break;

          default:
            break;
        }

        return true;
      }
    });
  },

  start: function() {
    this._bIsStarted = true;
  },

  stop: function() {
    this._bIsStarted = false;
  },
  // TODO(rmoutard) : add a system to subscribe to the dispatcher.
});
