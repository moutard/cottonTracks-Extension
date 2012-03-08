'use strict';

/**
 * An abstraction for the underlying IndexDB API.
 *
 * Engine should not be used directly. It should be accessed through more abstract layers
 * which hide its inner workings.
 *
 * sDatabaseName = the name of the database we want to use (it will be created if necessary).
 * lObjectStoreNames = the list of names of object stores we need to use (they will be created if necessary).
 * mOnReadyCallback = the callback method that should be executed when the database is ready.
 */
Cotton.DB.Engine = function(sDatabaseName, lObjectStoreNames, mOnReadyCallback) {
  var self = this;

  this._sDatabaseName = sDatabaseName;
  this._oDb = null;

  var oRequest = webkitIndexedDB.open(sDatabaseName);
  oRequest.onsuccess = function(oEvent) {
    var oDb = self._oDb = oEvent.target.result;

    // We need to compare whether the current list of object stores in the database matches the
    // object stores that are requested in lObjectStoreNames.

    var lCurrentObjectStoreNames = _.toArray(oDb.objectStoreNames);

    // lUsedObjectStoreNames is the list of object stores that are already present in the database
    // and match the requested list of object stores. For example, if we ask for two stores
    // ['abc, 'def'] and the present stores are ['abc', 'ghi'], lUsedObjectStoreNames will contain
    // ['abc'] (still ).
    var lUsedObjectStoreNames = _.intersection(lCurrentObjectStoreNames, lObjectStoreNames);

    // See if there are any object stores missing.
    var lMissingObjectStoreNames = _.difference(lObjectStoreNames, lUsedObjectStoreNames);

    if (lMissingObjectStoreNames.length > 0) {

      var iNewVersion = parseInt(oDb.version) + 1;

      // We need to update the database.
      // We can only create Object stores in a setVersion transaction.
      var oSetVersionRequest = oDb.setVersion(iNewVersion);

      oSetVersionRequest.onsuccess = function(oEvent) {
        for (var i = 0, sMissingObjectStoreName; sMissingObjectStoreName = lMissingObjectStoreNames[i]; i++) {
          console.log('Creating object store ' + sMissingObjectStoreName);
          oDb.createObjectStore(sMissingObjectStoreName, {
            keyPath: 'id',
            autoIncrement: true
          });
        }
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
  list: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

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
  put: function(sObjectStoreName, dItem, mOnSaveCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // TODO(fwouts): Checks on the type of data contained in dItem?
    var oPutRequest = oStore.put(dItem);

    oPutRequest.onsuccess = function(oEvent) {
      mOnSaveCallback.call(self);
    };

    // TODO(fwouts): Implement.
    // oPutRequest.onerror = ;
  },

  // TODO(fwouts): Can there be keys that are not strings and not integers?
  delete: function(sObjectStoreName, oId, mOnDeleteCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    var oDeleteRequest = oStore.delete(oId);

    oDeleteRequest.onsuccess = function(oEvent) {
      mOnDeleteCallback.call(self);
    };

    // TODO(fwouts): Implement.
    // oDeleteRequest.onerror = ;
  }
});
