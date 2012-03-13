'use strict';

/**
 * An abstraction for the underlying IndexDB API.
 *
 * Engine should not be used directly. It should be accessed through more abstract layers
 * which hide its inner workings.
 *
 * sDatabaseName = the name of the database we want to use (it will be created if necessary).
 * dIndexesForObjectStoreNames = a dictionary where keys are the names of object stores we need to use
 *                              (they will be created if necessary) and values are the dictionary of
 *                              index properties for each object store.
 * mOnReadyCallback = the callback method that should be executed when the database is ready.
 */
Cotton.DB.Engine = function(sDatabaseName, dIndexesForObjectStoreNames, mOnReadyCallback) {
  var self = this;

  this._sDatabaseName = sDatabaseName;
  this._oDb = null;

  var oRequest = webkitIndexedDB.open(sDatabaseName);
  oRequest.onsuccess = function(oEvent) {
    var oDb = self._oDb = oEvent.target.result;

    var bHasMissingObjectStore = false;
    var bHasMissingIndexKey = false;

    var lObjectStoreNames = _.keys(dIndexesForObjectStoreNames);

    // We need to compare whether the current list of object stores in the database matches the
    // object stores that are requested in lObjectStoreNames.

    var lCurrentObjectStoreNames = _.toArray(oDb.objectStoreNames);

    // lExistingObjectStoreNames is the list of object stores that are already present in the database
    // and match the requested list of object stores. For example, if we ask for two stores
    // ['abc, 'def'] and the present stores are ['abc', 'ghi'], lExistingObjectStoreNames will contain
    // ['abc'] (still ).
    var lExistingObjectStoreNames = _.intersection(lCurrentObjectStoreNames, lObjectStoreNames);

    // See if there are any object stores missing.
    var lMissingObjectStoreNames = _.difference(lObjectStoreNames, lExistingObjectStoreNames);
    bHasMissingObjectStore = lMissingObjectStoreNames.length > 0;

    // Check if, among the present object stores, there is any that miss an index.
    var dMissingIndexKeysForObjectStoreNames = {};
    if (lExistingObjectStoreNames.lenght > 0) {
      var oTransaction = oDb.transaction(lExistingObjectStoreNames, webkitIDBTransaction.READ_WRITE);
      _.each(lExistingObjectStoreNames, function(sExistingObjectStoreName) {
        var lMissingIndexKeys = dMissingIndexKeysForObjectStoreNames[sExistingObjectStoreName] = [];
        _.each(dIndexesForObjectStoreNames[sExistingObjectStoreName], function(dIndexDescription, sIndexKey) {
          try {
            oTransaction.objectStore(sExistingObjectStoreName).index(sIndexKey);
          } catch (e) {
            // TODO(fwouts): Check that e is an instance of NotFoundError.
            lMissingIndexKeys.push(sIndexKey);
            bHasMissingIndexKey = true;
          }
        });
      });
    }

    if (bHasMissingObjectStore || bHasMissingIndexKey) {

      var iNewVersion = parseInt(oDb.version) + 1;

      // We need to update the database.
      // We can only create Object stores in a setVersion transaction.
      var oSetVersionRequest = oDb.setVersion(iNewVersion);

      oSetVersionRequest.onsuccess = function(oEvent) {

        for (var i = 0, sMissingObjectStoreName; sMissingObjectStoreName = lMissingObjectStoreNames[i]; i++) {
          // Create the new object store.
          console.log('Creating object store ' + sMissingObjectStoreName);
          var objectStore = oDb.createObjectStore(sMissingObjectStoreName, {
            keyPath: 'id',
            autoIncrement: true
          });
          // Add all the indexes on the newly created object store.
          var dIndexesInformation = dIndexesForObjectStoreNames[sMissingObjectStoreName];
          _.each(dIndexesInformation, function(dIndexDescription, sIndexKey) {
            objectStore.createIndex(sIndexKey, sIndexKey, dIndexDescription);
          });
        }

        // Add all the missing indexes on the existing object stores.
        _.each(dMissingIndexKeysForObjectStoreNames, function(lMissingIndexKeys, sObjectStoreName) {
          var dIndexesInformation = dIndexesForObjectStoreNames[sObjectStoreName];
          var objectStore = oSetVersionRequest.transaction.objectStore(sObjectStoreName);
          _.each(lMissingIndexKeys, function(sIndexKey) {
            console.log('Adding index ' + sIndexKey + ' on object store ' + sObjectStoreName);
            objectStore.createIndex(sIndexKey, sIndexKey, dIndexesInformation[sIndexKey]);
          });
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
  list: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.lowerBound(0);
    var oCursorRequest = oStore.openCursor(oKeyRange);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        return;
      }

      mResultElementCallback.call(self, oResult.value);

      oResult.continue();
    };

    // TODO(fwouts): Implement.
    // oCursorRequest.onerror = ;
  },

  getRange : function(sObjectStoreName, iLowerBound, iUpperBound, mResultElementCallback){
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound, false, false);
    var oCursorRequest = oStore.openCursor(oKeyRange, 2);
    // direction 2 : prev

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        return;
      }

      mResultElementCallback.call(self, oResult.value);

      oResult.continue();
    };

    // TODO(rmoutard): Implement.
    // oCursorRequest.onerror = ;

  },


  getLastEntry : function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.only(0);
    var oCursorRequest = oStore.openCursor(undefined, 2);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        return;
      }

      mResultElementCallback.call(self, oResult.value);

    };

    // TODO(rmoutard): Implement.
    // oCursorRequest.onerror = ;

  },

  find: function(sObjectStoreName, sIndexKey, oIndexValue, mResultCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);
    var oIndex = oStore.index(sIndexKey);

    // Get the requested record in the store.
    var oFindRequest = oIndex.get(oIndexValue);

    oFindRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;
      // If there was no result, it will send back null.
      mResultCallback.call(self, oResult);
    };

    // TODO(fwouts): Implement.
    // oFindRequest.onerror = ;
  },

  // TODO(fwouts): Dictionary or object?
  put: function(sObjectStoreName, dItem, mOnSaveCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName], webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // TODO(fwouts): Checks on the type of data contained in dItem?
    if (!dItem.id) {
      // In order for the id to be automatically generated, we cannot set it to undefined or null, it
      // must not exist.
      delete dItem.id;
    }
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
