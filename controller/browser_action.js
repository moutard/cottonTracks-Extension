"use strict";

/**
 * In charge of listening events from the browser action (button on the top left
 * of the search bar.)
 */
Cotton.Controllers.BrowserAction = Class.extend({

  _oMainController : undefined,

  init: function(oMainController) {
    var self = this;
    this._oMainController = oMainController;

    // Listen the click event and receive informations about the tab
    // that  trigger the event.
    chrome.browserAction.onClicked.addListener(function() {

      self._oMainController._iTriggerHistoryItem = -1;

      // Get the current tab (opened on the focused window for chrome).
      // Rq: chrome.tabs.getSelected is now deprecated. chrome.tabs.query is
      // used instead
      chrome.tabs.query({
        'active':true,
        'lastFocusedWindow': true
      }, function(lTabs) {
        // Url of the tab that called the browser action.
        var sCallerTabUrl = lTabs[0]['url'];
        if (sCallerTabUrl === chrome.extension.getURL('lightyear.html')) {
          // The tab that make the call to the browser action is already lightyear,
          // so the UI page will listen to the event go back to the manager.
          // Do nothing from background.
        } else {
          Cotton.ANALYTICS.showLightyear();
          self._oMainController._iCallerTabId = lTabs[0]['id'];
          var iCallerTabIndex = lTabs[0]['index'];
          chrome.tabs.query({}, function(lTabs) {
            var iOpenTabs = lTabs.length;
            var iCount = 0;
            var lStoriesIdWithoutTrigger = [];

            // We authorize one cT tab per window.
            chrome.windows.getLastFocused({}, function(oWindow) {
              var iCurrentWindow = oWindow['id'];
              for (var i = 0, oTab; oTab = lTabs[i]; i++) {
                if (oTab['url'] === chrome.extension.getURL('lightyear.html')
                  && oTab['windowId'] === iCurrentWindow) {
                    var oCottonTab = oTab;
                }
                self._oMainController.getStoryFromTab(oTab, function() {
                  iCount++;
                  if (iCount === iOpenTabs) {
                    var iLength = self._oMainController._lStoriesInTabsId.length;
                    for (var i = 0; i < iLength; i++) {
                      var iStoryInTabsId = self._oMainController._lStoriesInTabsId[i];
                      if (iStoryInTabsId !== self._oMainController._iTriggerStory) {
                        lStoriesIdWithoutTrigger.push(iStoryInTabsId);
                      }
                    }
                    self._oMainController._lStoriesInTabsId = lStoriesIdWithoutTrigger;
                    if (oCottonTab) {
                      chrome.tabs.remove(oCottonTab['id']);
                    }
                    if (sCallerTabUrl === "chrome://newtab/") {
                      chrome.tabs.update(self._oMainController._iCallerTabId, {'url': 'lightyear.html'});
                    } else {
                      chrome.tabs.create({
                        'url': 'lightyear.html',
                        'index': iCallerTabIndex + 1,
                        'openerTabId': self._oMainController._iCallerTabId
                      });
                    }
                  }
                });
              }
            });
          });
        }
      });
    });
  },
});
