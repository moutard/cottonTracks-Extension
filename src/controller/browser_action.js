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
    // that triggered the event.
    chrome.browserAction.onClicked.addListener(function() {
      var sPage = (localStorage.getItem('proto_test') === "true") ? 'woody.html' : 'lightyear.html';

      // Get the current tab (opened on the focused window for chrome).
      // Rq: chrome.tabs.getSelected is now deprecated. chrome.tabs.query is
      // used instead
      chrome.tabs.query({
        'active':true,
        'lastFocusedWindow': true
      }, function(lTabs) {
        // Url of the tab that called the browser action.
        var sCallerTabUrl = lTabs[0]['url'];
        //TODO(rkorach) check that there is no problem with 'lightyear.html?sid=303'
        if (sCallerTabUrl === chrome.extension.getURL(sPage)) {
          // The tab that make the call to the browser action is already lightyear,
          // so the UI page will listen to the event go back to the manager.
          // Do nothing from background.
        } else {
          // Analytics tracking.
          Cotton.ANALYTICS.openLightyear('browser_action');

          self._oMainController._iCallerTabId = lTabs[0]['id'];
          var iCallerTabIndex = lTabs[0]['index'];
          chrome.tabs.query({}, function(lTabs) {
            // We authorize one cT tab per window.
            chrome.windows.getLastFocused({}, function(oWindow) {
              var iCurrentWindow = oWindow['id'];
              var iLength = lTabs.length;
              for (var i = 0; i < iLength; i++) {
                var oTab = lTabs[i];
                if (oTab['url'] === chrome.extension.getURL(sPage)
                  && oTab['windowId'] === iCurrentWindow) {
                    var oCottonTab = oTab;
                }
              }
              if (oCottonTab) {
                chrome.tabs.remove(oCottonTab['id']);
              }
              if (sCallerTabUrl === "chrome://newtab/"
                || sCallerTabUrl === "https://www.google.com/webhp?sourceid=chrome-instant&espv=210&es_sm=91&ie=UTF-8") {
                chrome.tabs.update(self._oMainController._iCallerTabId, {'url': sPage});
              } else {
                chrome.tabs.create({
                  'url': sPage,
                  'index': iCallerTabIndex + 1,
                  'openerTabId': self._oMainController._iCallerTabId
                });
              }
            });
          });
        }
      });
    });
  },
});
