'use strict';

Cotton.DB.Engine = function(sDatabaseName, mOnReadyCallback) {
  var self = this;
  
  this._sDatabaseName = sDatabaseName;
  this._oDb = null;
  
  var oRequest = webkitIndexedDB.open(sDatabaseName);
  oRequest.onsuccess = function(oEvent) {
    var oDb = self._oDb = oEvent.target.result;

    // TODO(fwouts): Clean this up.
    var sVersion = '1.0';
    if(sVersion != oDb.version) {
      // We need to update the database.
      // We can only create Object stores in a setVersion transaction.
      var oSetVersionRequest = oDb.setVersion(sVersion);

      oSetVersionRequest.onsuccess = function(oEvent) {
        // TODO(fwouts): Do not use 'stories' here.
        var oStore = oDb.createObjectStore('stories', {
          keyPath: 'id'
        });
        mOnReadyCallback.call(self);
      };
      // TODO(fwouts): Implement.
      // oSetVersionRequest.onfailure = ;
    } else {
      // The database is already up to date, so we are ready.
      mOnReadyCallback.call(self);
    }
  };

  // TODO(fwouts): Implement.
  // oRequest.onfailure = ;
};

$.extend(Cotton.DB.Engine.prototype, {
  list: function(mResultElementCallback) {
    var self = this;
    
    // TODO(fwouts): Do not use 'stories' here.
    var oTransaction = this._oDb.transaction(['stories'], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore('stories');

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.lowerBound(0);
    var oCursorRequest = oStore.openCursor(oKeyRange);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;
      
      // TODO(fwouts): Figure out what this does exactly.
      if (!oResult) {
        return;
      }

      mResultElementCallback.call(self, oResult.value);
      
      oResult.continue();
    };

    // TODO(fwouts): Implement.
    // oCursorRequest.onerror = ;
  },
  
  // TODO(fwouts): Dictionary or object?
  put: function(dItem, mOnSaveCallback) {
    var self = this;
    
    // TODO(fwouts): Do not use 'stories' here.
    var oTransaction = this._oDb.transaction(['stories'], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore('stories');
    
    // TODO(fwouts): Checks on the type of data contained in dItem?
    var oPutRequest = oStore.put(dItem);
    
    oPutRequest.onsuccess = function(oEvent) {
      mOnSaveCallback.call(self);
    };

    // TODO(fwouts): Implement.
    // oPutRequest.onerror = ;
  },

  // TODO(fwouts): Can there be keys that are not strings and not integers?
  delete: function(oId, mOnDeleteCallback) {
    var self = this;

    // TODO(fwouts): Do not use 'stories' here.
    var oTransaction = this._oDb.transaction(['stories'], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore('stories');

    var oDeleteRequest = oStore.delete(oId);

    oDeleteRequest.onsuccess = function(oEvent) {
      mOnDeleteCallback.call(self);
    };

    // TODO(fwouts): Implement.
    // oDeleteRequest.onerror = ;
  }
});

// Static methods.
$.extend(Cotton.DB.Engine, {
  
});
