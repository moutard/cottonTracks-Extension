'use strict';

/**
 * An abstraction for the underlying IndexDB API.
 * 
 * Engine should not be used directly. It should be accessed through more
 * abstract layers which hide its inner workings.
 * 
 * sDatabaseName = the name of the database we want to use (it will be created
 * if necessary). dIndexesForObjectStoreNames = a dictionary where keys are the
 * names of object stores we need to use (they will be created if necessary) and
 * values are the dictionary of index properties for each object store.
 * mOnReadyCallback = the callback method that should be executed when the
 * database is ready.
 */
Cotton.DB.Engine = function(sDatabaseName, dIndexesForObjectStoreNames, mOnReadyCallback) {
  var self = this;

  this._sDatabaseName = sDatabaseName;
  this._oDb = null;

  // https://developer.mozilla.org/en/IndexedDB/IDBCursor#Constants
  this._lCursorDirections = ["NEXT", "NEXT_NO_DUPLICATE",
                             "PREV", "PREV_NO_DUPLICATE"];

  var oRequest = webkitIndexedDB.open(sDatabaseName);
  oRequest.onsuccess = function(oEvent) {
    var oDb = self._oDb = oEvent.target.result;

    var bHasMissingObjectStore = false;
    var bHasMissingIndexKey = false;

    var lObjectStoreNames = _.keys(dIndexesForObjectStoreNames);

    // We need to compare whether the current list of object stores in the
    // database matches the
    // object stores that are requested in lObjectStoreNames.

    var lCurrentObjectStoreNames = _.toArray(oDb.objectStoreNames);

    // lExistingObjectStoreNames is the list of object stores that are already
    // present in the database
    // and match the requested list of object stores. For example, if we ask for
    // two stores
    // ['abc, 'def'] and the present stores are ['abc', 'ghi'],
    // lExistingObjectStoreNames will contain
    // ['abc'] (still ).
    var lExistingObjectStoreNames = _.intersection(lCurrentObjectStoreNames, lObjectStoreNames);

    // See if there are any object stores missing.
    var lMissingObjectStoreNames = _.difference(lObjectStoreNames, lExistingObjectStoreNames);
    bHasMissingObjectStore = lMissingObjectStoreNames.length > 0;

    // Check if, among the present object stores, there is any that miss an
    // index.
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
  iterList: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
      webkitIDBTransaction.READ_WRITE);
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

  listInverse: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.lowerBound(0);
    var oCursorRequest = oStore.openCursor(oKeyRange, 2);

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

  getList : function(sObjectStoreName, mResultElementCallback) {
    // a bit different of list. Because it returns an array of all the result.
    // The function list iterate on each element. The callback function is
    // called on each element. Here the callback function is called on the array
    // of all the elements.
    var lAllItems = new Array();
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.lowerBound(0);
    var oCursorRequest = oStore.openCursor(oKeyRange);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;
      if (oResult) {
        lAllItems.push(oResult.value);
        oResult.continue();
      }
      else {
        mResultElementCallback.call(self, lAllItems);
        return;
      }
    };
  },

  iterRange : function(sObjectStoreName, iLowerBound, iUpperBound,
                  mResultElementCallback){
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound,
                                            false, false);
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

  getRange : function(sObjectStoreName, iLowerBound, iUpperBound, 
      mResultElementCallback){
    var self = this;

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound,
                                            false, false);
    var oCursorRequest = oStore.openCursor(oKeyRange, 2);
    // direction 2 : prev

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        mResultElementCallback.call(self, lAllItems);
        return;
      }
      else {
        lAllItems.push(oResult.value);
        oResult.continue();
      }
    };

    // TODO(rmoutard): Implement.
    // oCursorRequest.onerror = ;
  },

  getKeyRange : function(sObjectStoreName, sIndexKey, iLowerBound, iUpperBound,
                    mResultElementCallback){
    var self = this;

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound,
                                            false, false);
    var oCursorRequest = oIndex.openCursor(oKeyRange, 2);
    // direction 2 : prev

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        mResultElementCallback.call(self, lAllItems);
        return;
      }
      else {
        lAllItems.push(oResult.value);
        oResult.continue();
      }
    };

    // TODO(rmoutard): Implement.
    // oCursorRequest.onerror = ;
  },

  getUpperBound : function(sObjectStoreName, sIndexKey, iUpperBound,
                            iDirection, bStrict, mResultElementCallback) {
    // bStrict == false All keys[sIndexKey] ≤ iUpperBound
    // iUpperBound may be not an int.
    var self = this;

    // Allow user to put "PREV" instead of 2 to get redeable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }

    //
    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                                              webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.upperBound(iUpperBound, bStrict);
    var oCursorRequest = oIndex.openCursor(oKeyRange, iDirection);
    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        mResultElementCallback.call(self, lAllItems);
        return;
      }
      else {
        lAllItems.push(oResult.value);
        oResult.continue();
      }
    };

    // TODO(rmoutard): Implement.
    // oCursorRequest.onerror = ;

  },

  getLowerBound : function(sObjectStoreName, sIndexKey, iLowerBound,
                      iDirection, bStrict, mResultElementCallback) {
    // bStrict == false All keys[sIndexKey] ≥ iLowerBound
    // iUpperBound may be not an int.
    var self = this;

    // Allow user to put "PREV" instead of 2 to get redeable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                                              webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.lowerBound(iLowerBound, bStrict);
    var oCursorRequest = oIndex.openCursor(oKeyRange, iDirection);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        mResultElementCallback.call(self, lAllItems);
        return;
      }
      else {
        lAllItems.push(oResult.value);
        oResult.continue();
      }
    };

    // TODO(rmoutard): Implement.
    // oCursorRequest.onerror = ;

  },

  getBound : function(sObjectStoreName, sIndexKey, iLowerBound, iUpperBound,
                      iDirection, bStrictLower, bStrictUpper, 
                      mResultElementCallback) {
    var self = this;

    // Allow user to put "PREV" instead of 2 to get readable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                                              webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound,
                                            bStrictLower, bStrictUpper);
    var oCursorRequest = oIndex.openCursor(oKeyRange, iDirection);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        mResultElementCallback.call(self, lAllItems);
        return;
      }
      else {
        lAllItems.push(oResult.value);
        oResult.continue();
      }
    };

    // TODO(rmoutard): Implement.
    // oCursorRequest.onerror = ;


  },

  getLastEntry : function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the Range.
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

  getLast : function(sObjectStoreName, sIndexKey, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define Index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.only(0);
    var oCursorRequest = oIndex.openCursor(undefined, 2);

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

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
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

  findGroup: function(sObjectStoreName, sIndexKey, lIndexValue,
                 mResultCallback) {
    var self = this;

    var lAllItems = new Array();
    var p = 0;
    for(var i = 0, oIndexValue; oIndexValue = lIndexValue[i]; i++){
      self.find(sObjectStoreName, sIndexKey, oIndexValue, function(oResult){
        p+=1;
        if(oResult){
          lAllItems.push(oResult);
        }

        if(p === lIndexValue.length){
          mResultCallback.call(self, lAllItems);
        }
      });
    }


  },

  // TODO(fwouts): Dictionary or object?
  // Seems there is a problem with put and auto-incremented.
  add: function(sObjectStoreName, dItem, mOnSaveCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // TODO(fwouts): Checks on the type of data contained in dItem?
    if (!dItem.id) {
      // In order for the id to be automatically generated, we cannot set it to
      // undefined or null, it
      // must not exist.
      delete dItem.id;
    }
    var oPutRequest = oStore.add(dItem);

    oPutRequest.onsuccess = function(oEvent) {
      mOnSaveCallback.call(self, oEvent.target.result);
    };

    // TODO(fwouts): Implement.
    // oPutRequest.onerror = ;
  },
  put: function(sObjectStoreName, dItem, mOnSaveCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // TODO(fwouts): Checks on the type of data contained in dItem?
    if (!dItem.id) {
      // In order for the id to be automatically generated, we cannot set it to
      // undefined or null, it
      // must not exist.
      delete dItem.id;
    }
    var oPutRequest = oStore.put(dItem);

    oPutRequest.onsuccess = function(oEvent) {
      mOnSaveCallback.call(self, oEvent.target.result);
    };

    // TODO(fwouts): Implement.
    // oPutRequest.onerror = ;
  },

  // TODO(fwouts): Can there be keys that are not strings and not integers?
  delete: function(sObjectStoreName, oId, mOnDeleteCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    var oDeleteRequest = oStore.delete(oId);

    oDeleteRequest.onsuccess = function(oEvent) {
      mOnDeleteCallback.call(self);
    };

    // TODO(fwouts): Implement.
    // oDeleteRequest.onerror = ;
  },
  
  purge: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
      webkitIDBTransaction.READ_WRITE);
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.lowerBound(0);
    var oCursorRequest = oStore.openCursor(oKeyRange);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        mResultElementCallback.call(self);
        return;
      }
      
      self.delete(sObjectStoreName, oResult.value.id, function(){
        console.log("entry deleted");
      });
      oResult.continue();
    };

    // TODO(fwouts): Implement.
    // oCursorRequest.onerror = ;
  },
  
});
