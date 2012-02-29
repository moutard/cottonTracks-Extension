'use strict';

/**
 * An abstraction for the underlying IndexDB API.
 *
 * Currently, all objects are recorded in the same object store, but their id is used to
 * differentiate their type. The structure of the id is ['object_type', object_numeric_id].
 * Note that object_numeric_id only has to be unique for a given object_type.
 *
 * Engine should not be used directly. It should be accessed through more abstract layers
 * which hide its inner workings.
 */
Cotton.DB.Engine = function(sDatabaseName, mOnReadyCallback) {
  var self = this;
  
  this._sDatabaseName = sDatabaseName;
  this._oDb = null;
  
  var oRequest = webkitIndexedDB.open(sDatabaseName);
  oRequest.onsuccess = function(oEvent) {
    var oDb = self._oDb = oEvent.target.result;

    // TODO(fwouts): Clean this up.
    var sVersion = '1.1';
    if(sVersion != oDb.version) {
      // We need to update the database.
      // We can only create Object stores in a setVersion transaction.
      var oSetVersionRequest = oDb.setVersion(sVersion);

      oSetVersionRequest.onsuccess = function(oEvent) {
        var oStore = oDb.createObjectStore('objects', {
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
    
    var oTransaction = this._oDb.transaction(['objects'], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore('objects');

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
    
    var oTransaction = this._oDb.transaction(['objects'], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore('objects');
    
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

    var oTransaction = this._oDb.transaction(['objects'], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore('objects');

    var oDeleteRequest = oStore.delete(oId);

    oDeleteRequest.onsuccess = function(oEvent) {
      mOnDeleteCallback.call(self);
    };

    // TODO(fwouts): Implement.
    // oDeleteRequest.onerror = ;
  }
});
