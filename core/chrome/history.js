'use strict';
Cotton.Core.Chrome.History = {};

Cotton.Core.Chrome.History.Client = Class.extend({
  init : function() {

  },

  get : function(dArguments, mCallback) {
    chrome.history.search(dArguments, mCallback);
  },
});
