'use strict';

Cotton.Controllers.Popstater = Class.extend({

  /**
   * {int} remember the place is the history tree
   * useful to know how many previous or next states exist
   */
  _iHistoryState : null,

  init: function(oLightyearController, oGlobalDispatcher) {
    var self = this;
    this._oLightyearController = oLightyearController;
    this._oGlobalDispatcher = oGlobalDispatcher;

    oGlobalDispatcher.subscribe('window_ready', this, function() {
      if (!oLightyearController._oWorld.isReady()) {
        // Db was ready before window.
        oLightyearController._oWorld.createWorld();
      }
      self._handlePopstate();
    });

    if (oLightyearController._oWorld.isReady()) {
      // Window was ready before Db.
      self._handlePopstate();
    }

    oGlobalDispatcher.subscribe('window_popstate', this, function(dArguments) {
      if (!dArguments['first_popstate']) {
        // The first _handlePopstate is done "manually" (at init) to avoid async problems
        // if the window.popstate event occurs before or after the popstater is created.
        self._handlePopstate();
      }
    });

    oGlobalDispatcher.subscribe('enter_story', this, function(dArguments){
      if (!dArguments['noPushState']) {
        this._iHistoryState++;
        this.pushState(chrome.extension.getURL("lightyear.html") + "?sid=" + dArguments['story'].id(), this._iHistoryState);
        // will set the navigation arrows
        this.updateHistoryArrows()
      }
    });

    oGlobalDispatcher.subscribe('search_stories', this, function(dArguments){
      if (!dArguments['noPushState']) {
        var sSearchUrl = chrome.extension.getURL("lightyear.html") + '?q=' + dArguments['search_words'].join('+');
        this._iHistoryState++;
        this.pushState(sSearchUrl, this._iHistoryState);
        // will set the navigation arrows
        this.updateHistoryArrows();
      }
    });

    oGlobalDispatcher.subscribe('open_manager', this, function(dArguments){
      if (!dArguments || !dArguments['noPushState']) {
        this._iHistoryState++;
        this.pushState(chrome.extension.getURL("lightyear.html"), this._iHistoryState);
        // will set the navigation arrows
        this.updateHistoryArrows()
      }
    });

    oGlobalDispatcher.subscribe('previous_page', this, function(){
      // the UI 'previous' button has been clicked
      window.history.back();
    });

    oGlobalDispatcher.subscribe('next_page', this, function(){
      // the UI 'next' button has been clicked
      window.history.forward();
    });
  },

  _handlePopstate : function() {
    var self = this;

    if (window.history.state) {
      // we land on the UI with already a custom history state
      // for example if you refresh the page
      self._iHistoryState = window.history.state['count'];
    } else {
      // we land on the UI from a fresh page, replace the default history state by our
      // custom state
      self._iHistoryState = window.history.length;
      self.replaceState(window.location.href, self._iHistoryState);
    }
    // will set the navigation arrows
    self._oGlobalDispatcher.publish('change_history_state', {
      'state': self._iHistoryState,
      'history_length': window.history.length
    });

    var oUrl = new UrlParser(window.history.state['path']);
    oUrl.fineDecomposition();
    if (oUrl.dSearch['sid']){
      //open on a story
      var iStoryId = parseInt(oUrl.dSearch['sid']);
      self._oLightyearController._oDatabase.find('stories', 'id', iStoryId, function(oStory){
        self._oLightyearController.fillStory(oStory, function(oFilteredStory){
          if (!oFilteredStory) {
            self.replaceState(chrome.extension.getURL("lightyear.html"), self._iHistoryState);
            self._oGlobalDispatcher.publish('home', {
              'noPushState': true,
            });
          } else {
            self._oGlobalDispatcher.publish('enter_story', {
              'story': oStory,
              'noPushState': true,
            });
          }
        });
      });
    } else if (oUrl.dSearch['q']) {
      // Search page.
      self._oGlobalDispatcher.publish('search_stories', {
        'search_words': oUrl.dSearch['q'].split('+'),
        'noPushState': true
      });
    } else {
      // open on the manager
      self._oGlobalDispatcher.publish('home', {
        'noPushState': true,
      });
    }
  },

  /**
   * @param {string} sUrl: information about the page to trigger (query, manager, story,...)
   * @param {int} iHistoryState: position of the page in the history tree
   */
  pushState : function(sUrl, iHistoryState){
    // we can store information in this if needed!
    history.pushState({
      path: sUrl,
      count: iHistoryState
    }, '', sUrl);
  },


  /**
   * @param {string} sUrl: information about the page to trigger (query, manager, story,...)
   * @param {int} iHistoryState: position of the page in the history tree
   */
  replaceState : function(sUrl, iHistoryState){
    history.replaceState({
      path: sUrl,
      count: iHistoryState
    }, '', sUrl);
  },

  /**
   * Sends a message to the history arrows to update to the right color (active/inactive)
   */
  updateHistoryArrows : function() {
    this._oGlobalDispatcher.publish('change_history_state', {
      'state': this._iHistoryState,
      'history_length': window.history.length
    });
  }

});