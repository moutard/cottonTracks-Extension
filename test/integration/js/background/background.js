'use strict';

// Allow to wait until the integration background is ready.
QUnit.config.autostart = false;

var IntegrationBackground = Class.extend({

  _oDatabase : undefined,

  init: function() {
    var self = this;
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ctb', {
        'searchKeywords': Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS,
        'historyItems': Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'stories': Cotton.Translators.STORY_TRANSLATORS
      }, function() {
        // Get the historyClient (depends on the browser)
        var oClient = new MockHistoryClient();
        Cotton.Core.Populate.visitItems(self._oDatabase,
          function(lHistoryItems, lVisitItems) {
            chrome.tabs.create({
              "url": "integration_tests.html"
            });
            chrome.tabs.create({
              "url": "quality.html"
            });

            // Start tests.
            start();
        }, oClient);
    });
  },

  database : function() {
    return this._oDatabase;
  },

});

var oIntegrationBackground = new IntegrationBackground();


