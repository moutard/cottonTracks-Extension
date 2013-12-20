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

    oGlobalDispatcher.subscribe('push_state', this, function(dArguments){
      this._oGlobalDispatcher.publish('scrolloffset', {'scroll': 0});
      this._iHistoryState++;
      this.pushState(chrome.extension.getURL("lightyear.html") + dArguments['code'] + dArguments['value'],
        this._iHistoryState);
      // will set the navigation arrows
      this.updateHistoryArrows();
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
    this._oGlobalDispatcher.publish('clear');

    var dState = window.history.state;

    if (dState) {
      // we land on the UI with already a custom history state
      // for example if you refresh the page
      self._iHistoryState = dState['count'];
    } else {
      // we land on the UI from a fresh page, replace the default history state by our
      // custom state
      self._iHistoryState = window.history.length;
      self.replaceState(window.location.href, self._iHistoryState);
      dState = window.history.state;
    }
    // will set the navigation arrows
    self._oGlobalDispatcher.publish('change_history_state', {
      'state': self._iHistoryState,
      'history_length': window.history.length
    });

    var oUrl = new UrlParser(dState['path']);
    oUrl.fineDecomposition();
    if (oUrl.dSearch['sid']){
      //open on a story
      var iStoryId = parseInt(oUrl.dSearch['sid']);
      self._oLightyearController._oDatabase.find('stories', 'id', iStoryId, function(oStory){
        self._oLightyearController.fillStory(oStory, function(oFilteredStory){
          if (!oFilteredStory) {
            // analytics tracking.
            Cotton.ANALYTICS.navigate('manager_fallback');
            self.replaceState(chrome.extension.getURL("lightyear.html"), self._iHistoryState);
            self._oGlobalDispatcher.publish('home', {
              'from_popstate': true,
            });
            self._oGlobalDispatcher.publish('scrolloffset', {'scroll': 0});
          } else {
            // analytics tracking.
            Cotton.ANALYTICS.navigate('story');
            self._oGlobalDispatcher.publish('enter_story', {
              'story': oStory
            });
            self._oGlobalDispatcher.publish('scrolloffset', {'scroll': dState['scroll']});
          }
        });
      });
    } else if (oUrl.dSearch['q']) {
      // Search page.
      self._oGlobalDispatcher.publish('search_stories', {
        'search_words': oUrl.dSearch['q'].split('+')
      });
      // analytics tracking.
      Cotton.ANALYTICS.navigate('search');
    } else if (oUrl.dSearch['p'] === 'favorites'){
      // favorites page.
      self._oGlobalDispatcher.publish('favorites');
    } else {
      // analytics tracking.
      Cotton.ANALYTICS.navigate('home');
      // open on the manager
      self._oGlobalDispatcher.publish('home', {
        'from_popstate': true
      });
    }
  },

  /**
   * @param {string} sUrl: information about the page to trigger (query, manager, story,...)
   * @param {int} iHistoryState: position of the page in the history tree
   */
  pushState : function(sUrl, iHistoryState){
    // analytics tracking
    Cotton.ANALYTICS.depth(iHistoryState);

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