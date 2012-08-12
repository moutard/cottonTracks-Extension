'use strict';

function firstInstall() {
  var oTabProperties = {};
  chrome.tabs.create(oTabProperties);
}

function getVersion() {
  var details = chrome.app.getDetails();
  return details.version;
}

// Check if extension version has changed.
var currVersion = getVersion();
var prevVersion = localStorage['ct-version'];
if (currVersion != prevVersion) {
  // Check if we installed the extension for the first time.
  if (typeof prevVersion == 'undefined') {
    firstInstall();
  } else {
    // we can provide an onUpdate() function for autoupdate news
  }
  localStorage['ct-version'] = currVersion;
}