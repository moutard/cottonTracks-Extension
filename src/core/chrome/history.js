'use strict';
Cotton.Core.History = {};

Cotton.Core.History.Client = Class.extend({
  init : function() {

  },

  get : function(dArguments, mCallback) {
    chrome.history.search(dArguments, mCallback);
  },

  getVisits : function(dArguments, mCallback) {
    chrome.history.getVisits(dArguments, mCallback);
  }
});
