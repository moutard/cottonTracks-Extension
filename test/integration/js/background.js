'use strict';
chrome.runtime.onInstalled.addListener(function(oInstallationDetails) {
  chrome.tabs.create({
    'url': 'integration_tests.html',
  }, function(){});
  chrome.tabs.create({
    'url': 'integration_charts.html',
  }, function(){});

});

