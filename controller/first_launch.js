'use strict';

// Check if extension version has changed.
var sCurrVersion = getVersion();
var sPrevVersion = localStorage['ct-version'];
if (sCurrVersion != sPrevVersion) {
  // Check if we installed the extension for the first time.
  if (typeof sPrevVersion == 'undefined') {
    firstInstall();
  } else {
    // event tracking
    Cotton.ANALYTICS.updateVersion(sCurrVersion);

    // onUpdate() function for autoupdate news
  }
  localStorage['ct-version'] = sCurrVersion;
}

function firstInstall() {
  // Open a new tab automatically at first install
  var oTabProperties = {
      'url': 'index.html'
  };
  chrome.tabs.create(oTabProperties);
}

function getVersion() {
  var oDetails = chrome.app.getDetails();
  return oDetails.version;
}