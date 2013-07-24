'use strict';
var IntegrationBackground = Class.extend({

  init: function() {
    var oDatabase = new Cotton.DB.IndexedDB.Wrapper('ctb', {
        'searchKeywords': Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS,
        'historyItems': Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'stories': Cotton.Translators.STORY_TRANSLATORS
      }, function() {
        // Get the historyClient (depends on the browser)
        var oClient = new MockHistoryClient();
        Cotton.Core.Populate.visitItems(oDatabase,
          function(lHistoryItems, lVisitItems) {
            chrome.tabs.create({
              "url": "integration_tests.html"
            });
        }, oClient);
    });
  },

});

var oIntegrationBackground = new IntegrationBackground();


