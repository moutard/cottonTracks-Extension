'use strict';
Cotton.Core.Mock.History = {};

Cotton.Core.Mock.History.Client = Class.extend({
  init : function() {

  },

  get : function(sString) {
    return chrome_history_source_hadrien;
  },
});
