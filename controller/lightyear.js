'use strict';
/**
 * Controller
 *
 * Inspired by MVC pattern.
 *
 * Handles DB, and UI.
 *
 */
Cotton.Controllers.Lightyear = Class.extend({

  /**
   * Global Store, that allow controller to make call to
   * the database. So it Contains 'historyItems', 'stories' and 'searchKeywords'.
   */
  _oDatabase : null,

  /**
   * Messenger for handling core message. (Chrome message)
   */
  _oCoreMessenger : null,

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * Global view, contains the Manager, the StoryContainer.
   * UI elements act as their own controllers.
   */
  _oWorld : null,

  /**
   * @param {Cotton.Core.Messenger} oCoreMessenger
   */
  init : function(oCoreMessenger) {
    var self = this;

    LOG && DEBUG && console.debug("Controller Lightyear - init -");

    this._oCoreMessenger = oCoreMessenger;
    this._oGlobalDispatcher = new Cotton.Messaging.Dispatcher();

    this._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {

    });

    $(window).ready(function(){
      self._oWorld = new Cotton.UI.World(oCoreMessenger, self._oGlobalDispatcher);
      self._bWorldReady = true;
    });
  }
});

var oCoreMessenger = new Cotton.Core.Messenger();
Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear(oCoreMessenger);
