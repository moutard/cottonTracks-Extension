'use strict';

Cotton.Controllers.Popstater = Class.extend({

  init: function(oLightyearController, oGlobalDispatcher) {
    var self = this;
    this._oLightyearController = oLightyearController;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this.replaceState(window.location.href);

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
        this.pushState(chrome.extension.getURL("lightyear.html") + "?sid=" + dArguments['story'].id());
      }
    });

    oGlobalDispatcher.subscribe('open_manager', this, function(dArguments){
      if (!dArguments || !dArguments['noPushState']) {
        this.pushState(chrome.extension.getURL("lightyear.html"));
      }
    });

  },

  _handlePopstate : function() {
    var self = this;
    var oUrl = new UrlParser(window.history.state['path']);
    oUrl.fineDecomposition();
    if (oUrl.dSearch['sid']){
      // Open on a story.
      var iStoryId = parseInt(oUrl.dSearch['sid']);
      this._oLightyearController._oDatabase.find('stories', 'id', iStoryId, function(oStory){
        self._oLightyearController.fillStory(oStory, function(oFilteredStory){
          if (!oFilteredStory) {
            self.replaceState(chrome.extension.getURL("lightyear.html"));
            self._oGlobalDispatcher.publish('home', {
              'noPushState': true
            });
          } else {
            self._oGlobalDispatcher.publish('enter_story', {
              'story': oFilteredStory,
              'noPushState': true
            });
          }
        });
      });
    } else {
      // Open on the manager.
      this._oGlobalDispatcher.publish('home', {
        'noPushState': true
      });
    }
  },

  pushState : function(sUrl) {
    history.pushState({path: sUrl}, '', sUrl);
  },

  replaceState : function(sUrl) {
    history.replaceState({path: sUrl}, '', sUrl);
  }

});