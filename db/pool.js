'use strict';

// the Pool database is a structure that store all the historyItems of the
// current session. Even if there are noise. The Pool is a small database, so
// the access should be fast.
// Each new tab, creates a new historyItem that is pushed in the Pool, and
// frequently update.
Cotton.DB.Pool = {};

Cotton.DB.Pool.push = function(oHistoryItem) {
  // 
  var oPool = new Cotton.DB.Store('ct', {
    'pool' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
  }, function() {
    this.put('pool', oHistoryItem, function() {

    });
  });
};

Cotton.DB.Pool.update = function(oHistoryItem) {
  // 
  var oPool = new Cotton.DB.Store('ct', {
    'pool' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
  }, function() {
    this.put('pool', oHistoryItem, function() {

    });
  });
};

// TOOLS
