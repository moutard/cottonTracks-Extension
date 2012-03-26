'use strict';

// the Pool database is a structure that store all the historyItems of the
// current session. Even if there are noise. The Pool is a small database, so
// the access should be fast.
// Each new tab, creates a new historyItem that is pushed in the Pool, and
// frequently update.
Cotton.DB.Pool = {};

Cotton.DB.Pool.push = function(oHistoryItem) {
  //
  console.log(oHistoryItem);
  console.log(oHistoryItem.id());
  var oPool = new Cotton.DB.Store('ct', {
    'pool' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
  }, function() {
    console.log("Pool ready");
    //try {
      this.put('pool', oHistoryItem, function() {
        console.log("Pushed in the pool.");
      });
    /*} catch (error) {
      console.log("Pool : push error");
      console.log(error);
      // Detect if another record in this object store has the same value for
      // the keyPath of a unique index.
      if(error.type === "ConstraintError"){
        // TODO(rmoutard) : check this if is enougth, maybe need to handle the
        // the message.
        // TODO(rmoutard) : maybe the error return a cursor with the existing
        // entry.
        Cotton.DB.Pool.update(oHistoryItem);
      }
    }*/
  });
};

Cotton.DB.Pool.update = function(oHistoryItem) {
  // 
  var oPool = new Cotton.DB.Store('ct', {
    'pool' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
  }, function() {
    //TODO(rmoutard) : if you don't find it you should push it.
    //maybe use the error non unique.
    this.find('pool', "url", oHistoryItem.url(), function(oFindHistoryItem) {
      console.log("Find an historyItem in the pool with the current Url");
      oFindHistoryItem.update(oHistoryItem);
      this.put('pool', oFindHistoryItem, function(){
        console.log("Updated in the pool");
      });
    });
  });
};

// TOOLS
