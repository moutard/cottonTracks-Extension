'use strict';

/**
 * An abstraction for the underlying IndexDB API.
 * See more infos : IndexedDB API http://www.w3.org/TR/IndexedDB/
 *
 * EngineIndexedDB should not be used directly. It should be accessed through
 * more abstract layers like ObjectDatabase which hide its inner workings.
 *
 * @param {String} sDatabaseName :
 *  the name of the database we want to use (it will be created
 *  if necessary).
 * @param {Dictionnary} dIndexesForObjectStoreNames :
 *  a dictionary where keys are the names of object stores we need to use (they
 *  will be created if necessary) and values are the dictionary of index
 *  properties for each object store.
 * @param {Function} mOnReadyCallback :
 *  the callback method that should be
 *  executed when the database is ready.
 */
Cotton.DB.IndexedDB.Engine = Class.extend({
  init :function(sDatabaseName, dIndexesForObjectStoreNames, mOnReadyCallback) {
    var self = this;
    var bUpgradeNeeded = false;
	  var lMissingObjectStoreNames = [];
    var dMissingIndexKeysForObjectStoreNames = {};
    var lMissingIndexKeys = [];

    this._sDatabaseName = sDatabaseName;
    this._oDb = null;

    // https://developer.mozilla.org/en/IndexedDB/IDBCursor#Constants
    this._lCursorDirections = ["NEXT", "NEXT_NO_DUPLICATE",
                               "PREV", "PREV_NO_DUPLICATE"];

    this._lNonDeprecatedCursorDirections = ["next", "nextunique",
                                            "prev", "prevunique"];

    // Open the database. Do not specify version by default.
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
      // and match the requested list of object stores. For example, if we ask
      // for
      // two stores
      // ['abc, 'def'] and the present stores are ['abc', 'ghi'],
      // lExistingObjectStoreNames will contain
      // ['abc'] (still ).
      var lExistingObjectStoreNames = _.intersection(lCurrentObjectStoreNames, lObjectStoreNames);

      // See if there are any object stores missing.
      lMissingObjectStoreNames = _.difference(lObjectStoreNames, lExistingObjectStoreNames);
      bHasMissingObjectStore = lMissingObjectStoreNames.length > 0;

      // Check if, among the present object stores, there is any that miss an
      // index.

      // FIXME !!
      // TODO(rmoutard) this part create a problem.
      if (lExistingObjectStoreNames.length > 0) {
        var oTransaction = oDb.transaction(lExistingObjectStoreNames, "readwrite");
        _.each(lExistingObjectStoreNames, function(sExistingObjectStoreName) {
          lMissingIndexKeys = dMissingIndexKeysForObjectStoreNames[sExistingObjectStoreName] = [];
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

      // If there are stores or index missing we need to update the database.
      // So we called open the database with a upper version, so the event
      // onupgradeneeded is called.
      if (bHasMissingObjectStore || bHasMissingIndexKey) {
        console.log("A new database version is needed");
        // If the version is not set, use 0 and the increment so when you
        // open the database for the first version the version is 1, because it
        // seems to have an error when you try to open a database when version
        // number is 0.
        var iNewVersionNumber = parseInt(oDb.version) || 0;
        iNewVersionNumber += 1;
        oDb.close();

        var oOpenDBWithUpperVersionRequest = webkitIndexedDB.open(sDatabaseName, iNewVersionNumber);

        // For chrome version < 25. This event is never called.
        oOpenDBWithUpperVersionRequest.onupgradeneeded = function(oEvent) {
          var oDb = self._oDb = oEvent.target.result;
          var oTransaction = event.target.transaction;

          self._upgradeVersion(oTransaction,
              lMissingObjectStoreNames,
              dIndexesForObjectStoreNames,
              dMissingIndexKeysForObjectStoreNames,
              mOnReadyCallback);

        };

        // For chrome version < 25 this event is called instead of onupgradeneeded
        // For chrome version > 25 this event is called after onupgradeneeded
        oOpenDBWithUpperVersionRequest.onsuccess = function(oEvent) {
          var oDb = self._oDb = oEvent.target.result;
          if (oDb.version !== iNewVersionNumber){
            var iNewVersion = parseInt(oDb.version) + 1;

            // We need to update the database.
            // We can only create Object stores in a setVersion transaction.
            // setVersion is DEPRECATED for chrome > 25.
            var oSetVersionRequest = oDb.setVersion(iNewVersion);

            oSetVersionRequest.onsuccess = function(event) {
              console.log("setVersion onsuccess");
              var oTransaction = event.target.result;

              self._upgradeVersion(oTransaction,
                  lMissingObjectStoreNames,
                  dIndexesForObjectStoreNames,
                  dMissingIndexKeysForObjectStoreNames,
                  mOnReadyCallback);

            };

            oSetVersionRequest.onerror = function(oEvent){
              console.error("setVersion error" + oEvent.message);
              console.error(oEvent);
              console.error(this);
              oDb.close();

              throw "SetVersionRequest error";
            };

            oSetVersionRequest.onblocked = function(oEvent){
              console.error("setVersion blocked. " + oEvent.message);
              console.error(oEvent);
              console.error(this);
              oDb.close();

              throw "SetVersionRequest blocked";
            };
          }
        };

        oRequest.onerror = function(oEvent){
          console.error("Can't open the database");
          console.error(oEvent);
          console.error(this);

          throw "Request Error - init engine";
        };

      } else {
        // The database is already up to date, so we are ready.
        console.log("The database is already up to date");
        mOnReadyCallback.call(self);
      }
    };
  },

  /**
   * Called during a "onupgradeneeded" event (or setVersion for chrome
   * version < 25). In charge of creating missing elements like stores or
   * indexes.
   *
   * @param {IndexedDB.Transaction} : oTransaction
   *  current transaction of the "onupgradeneeded" event.
   * @param {Array.<String>} : lMissingObjectStoreNames
   *  list of names of all the missing stores.
   * @param {Dictionnary} : dIndexesForObjectStoreNames
   *  For each stores the list of indexes.
   * @param {Dictionnary} : dMissingIndexKeysForObjectStoreNames
   *  For each stores missing list of missing indexes.
   * @param {Function} : mOnReadyCallback
   *  callback function when the database upgrade is over.
   */
  _upgradeVersion : function(oTransaction,
    lMissingObjectStoreNames, dIndexesForObjectStoreNames,
    dMissingIndexKeysForObjectStoreNames, mOnReadyCallback){

    var self = this;
    oTransaction.oncomplete = function(){
      console.log("setVersion result transaction oncomplete");
      mOnReadyCallback.call(self);
    };

    oTransaction.onabort = function(){
      console.error("setVersion result transaction onabort");
      self._oDb.close();
    };

    oTransaction.ontimeout = function(){
      console.error("setVersion result transaction ontimeout");
      self._oDb.close();
    };

    oTransaction.onerror = function(oEvent){
      console.error("transaction error" + oEvent.message);
      self._oDb.close();
      throw "Transaction error";
    };

    oTransaction.onblocked = function(oEvent){
      console.error("Transaction blocked. " + oEvent.message);
      self._oDb.close();
      throw "Transaction blocked";
    };

    try {
      for (var i = 0, sMissingObjectStoreName; sMissingObjectStoreName = lMissingObjectStoreNames[i]; i++) {
        // Create the new object store.
        console.log('Creating object store ' + sMissingObjectStoreName);
        var objectStore = self._oDb.createObjectStore(sMissingObjectStoreName, {
          'keyPath': 'id',
          'autoIncrement': true
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
        var objectStore = oTransaction.objectStore(sObjectStoreName);
        _.each(lMissingIndexKeys, function(sIndexKey) {
          console.log('Adding index ' + sIndexKey + ' on object store ' + sObjectStoreName);
          objectStore.createIndex(sIndexKey, sIndexKey, dIndexesInformation[sIndexKey]);
        });
      });

    } catch (oError){
      console.log("createObjectStore exception : " + oError.message);
      oTransaction.abort();
    }

  },

  /**
   * Return true if the store is empty.
   *
   * @param {string}
   *          sObjectStoreName
   * @param {function}
   *          mResultElementCallback
   */
  empty : function(sObjectStoreName, mResultElementCallback){
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
      "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.lowerBound(0);
    var oCursorRequest = oStore.openCursor(oKeyRange);

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        mResultElementCallback.call(self, true);
      } else {
        mResultElementCallback.call(self, false);
      }

    };


  },

  /**
   * Call the call back function on every element of the store.
   *
   * @param {string}
   *          sObjectStoreName
   * @param {function}
   *          mResultElementCallback
   */
  iterList: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
      "readwrite");
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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);

      throw "Cursor Request Error - iterList";
    };
  },

  listInverse: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.lowerBound(0);
    var oCursorRequest = oStore.openCursor(oKeyRange, "prev");

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        return;
      }

      mResultElementCallback.call(self, oResult.value);

      oResult.continue();
    };

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);

      throw "Cursor Request Error - listInverse";
    };

  },

  getList : function(sObjectStoreName, mResultElementCallback) {
    // a bit different of list. Because it returns an array of all the result.
    // The function list iterate on each element. The callback function is
    // called on each element. Here the callback function is called on the array
    // of all the elements.
    var lAllItems = new Array();
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
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
        "readwrite");
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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);

      throw "Cursor Request Error - iterRange";
    };

  },

  getRange : function(sObjectStoreName, iLowerBound, iUpperBound,
      mResultElementCallback){
    var self = this;

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Get everything in the store.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound,
                                            false, false);
    var oCursorRequest = oStore.openCursor(oKeyRange, "prev");
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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - get Range";
    };

  },

  getKeyRange : function(sObjectStoreName, sIndexKey, iLowerBound, iUpperBound,
                    mResultElementCallback){
    var self = this;

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound,
                                            false, false);
    var oCursorRequest = oIndex.openCursor(oKeyRange, "prev");
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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getKeyRange";
    };

  },

  getUpperBound : function(sObjectStoreName, sIndexKey, iUpperBound,
                            iDirection, bStrict, mResultElementCallback) {
    // bStrict == false All keys[sIndexKey] â<= iUpperBound
    // iUpperBound may be not an int.
    var self = this;

    // Allow user to put "PREV" instead of 2 to get redeable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }
    // use non deprecated cursor direction.
    var sDirection = this._lNonDeprecatedCursorDirections[iDirection];

    //
    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                                              "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.upperBound(iUpperBound, bStrict);
    var oCursorRequest = oIndex.openCursor(oKeyRange, sDirection);
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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getUpperBound";
    };


  },

  getLowerBound : function(sObjectStoreName, sIndexKey, iLowerBound,
                      iDirection, bStrict, mResultElementCallback) {
    // bStrict == false All keys[sIndexKey] â>= iLowerBound
    // iUpperBound may be not an int.
    var self = this;

    // Allow user to put "PREV" instead of 2 to get redeable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }
    var sDirection = this._lNonDeprecatedCursorDirections[iDirection];

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                                              "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.lowerBound(iLowerBound, bStrict);
    var oCursorRequest = oIndex.openCursor(oKeyRange, sDirection);

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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getLowerBound";
    };


  },

  getBound : function(sObjectStoreName, sIndexKey, iLowerBound, iUpperBound,
                      iDirection, bStrictLower, bStrictUpper,
                      mResultElementCallback) {
    var self = this;

    // Allow user to put "PREV" instead of 2 to get readable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }
    var sDirection = this._lNonDeprecatedCursorDirections[iDirection];

    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                                              "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.bound(iLowerBound, iUpperBound,
                                            bStrictLower, bStrictUpper);
    var oCursorRequest = oIndex.openCursor(oKeyRange, sDirection);

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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getBound";
    };



  },

  /**
   * getLastEntry :
   *
   * the last item in the database. Equivalent to getLast with sIndex = id
   *
   * @param sObjectStoreName
   * @param mResultElementCallback
   *          call back function
   *
   * @return the call back function return an dDBRecord element.
   */
  getLastEntry : function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // http://www.w3.org/TR/IndexedDB/#widl-IDBObjectStore-openCursor-IDBRequest-any-range-DOMString-direction
    // The first argument is nullabe.
    var oCursorRequest = oStore.openCursor(null, "prev");

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        return;
      }

      mResultElementCallback.call(self, oResult.value);

    };

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getLastEntry";
    };


  },

  /**
   * getLast :
   *
   * the last item sorted by sIndexKey.
   *
   * @param {string}
   *          sObjectStoreName : Object store name
   * @param {string}
   *          sIndexKey : name of the index used for sorting
   * @param {function}
   *          mResultElementCallback : callback function
   *
   * @return the call back function return an dDBRecord element.
   */
  getLast : function(sObjectStoreName, sIndexKey, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define Index.
    var oIndex = oStore.index(sIndexKey);

    var oCursorRequest = oIndex.openCursor(null, "prev");

    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        return;
      }

      mResultElementCallback.call(self, oResult.value);

    };

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getLast";
    };


  },

  /**
   * getXItems :
   *
   * get X items in a given direction
   *
   * @param {string}
   *          sObjectStoreName : Object store name
   * @param {int}
   *          iX : number of element you want
   * @param {string}
   *          sIndexKey : name of the index used for sorting
   * @param {string}
   *          iDirection :
   * @param {function}
   *          mResultElementCallback : callback function
   *
   * @return the call back function return an dDBRecord element.
   *
   */
  getXItems : function(sObjectStoreName, iX, sIndexKey,
      iDirection, mResultElementCallback) {
    // bStrict == false All keys[sIndexKey] â<= iUpperBound
    // iUpperBound may be not an int.
    var self = this;

    // Allow user to put "PREV" instead of 2 to get redeable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }
    var sDirection = this._lNonDeprecatedCursorDirections[iDirection];

    //
    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    var iCursorCount = 0;
    var oCursorRequest = oIndex.openCursor(null, sDirection);
    oCursorRequest.onsuccess = function(oEvent) {
      iCursorCount+=1;
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        // There is less than iX correspondings items.
        mResultElementCallback.call(self, lAllItems);
        return;
      } else if(iCursorCount === iX){
        // There is more than iX correspondings items, but return only the iXth
        // first.
        lAllItems.push(oResult.value);
        mResultElementCallback.call(self, lAllItems);
        return;
      }
      else {
        lAllItems.push(oResult.value);
        oResult.continue();
      }
    };

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getXItems";
    };


  },

  getXYItems : function(sObjectStoreName, iX, iY, sIndexKey,
      iDirection, mResultElementCallback) {
    // bStrict == false All keys[sIndexKey] â<= iUpperBound
    // iUpperBound may be not an int.
    var self = this;

    // Allow user to put "PREV" instead of 2 to get redeable code.
    var iDirectionIndex = _.indexOf(this._lCursorDirections, iDirection);
    if(iDirectionIndex !== -1){ iDirection = iDirectionIndex; }
    var sDirection = this._lNonDeprecatedCursorDirections[iDirection];

    //
    var lAllItems = new Array();
    var oTransaction = this._oDb.transaction([sObjectStoreName],
                        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index(sIndexKey);

    var iCursorCount = 0;
    var oCursorRequest = oIndex.openCursor(null, sDirection);
    oCursorRequest.onsuccess = function(oEvent) {
      iCursorCount+=1;
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        // There is less than iX correspondings items.
        mResultElementCallback.call(self, lAllItems);
        return;
      } else if(iX <= iCursorCount && iCursorCount <= iY){
        // There is more than iX correspondings items, but return only the iXth
        // first.
        lAllItems.push(oResult.value);

        if(iCursorCount === iY){
          mResultElementCallback.call(self, lAllItems);
          return;
        }

        oResult.continue();
      }
      else {
        oResult.continue();
      }
    };

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - getXYItems";
    };


  },

  find: function(sObjectStoreName, sIndexKey, oIndexValue, mResultCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);
    var oIndex = oStore.index(sIndexKey);

    // Get the requested record in the store.
    var oFindRequest = oIndex.get(oIndexValue);

    oFindRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;
      // If there was no result, it will send back null.
      mResultCallback.call(self, oResult);
    };

     oFindRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Find Request Error";
    };

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

  search: function(sObjectStoreName, sIndexKey, oIndexValue, mResultCallback) {
    // sIndexKey should have a multipleEntry as true.
    var self = this;

    var lResults = [];

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);
    var oIndex = oStore.index(sIndexKey);

    var oRangeSearch = webkitIDBKeyRange.only(oIndexValue);
    // Get the requested record in the store.
    var oSearchRequest = oIndex.openCursor(oRangeSearch);

    oSearchRequest.onsuccess = function(oEvent) {
      var oCursor = oEvent.target.result;
      if(oCursor){
        lResults.push(oCursor.value);
        oCursor.continue();
      } else {
        // If there was no result, it will send back null.
        mResultCallback.call(self, lResults);
      }
    };

    oSearchRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Search Request Error";
    };

  },

  // Seems there is a problem with put and auto-incremented.
  // DEPRECATED
  add: function(sObjectStoreName, dItem, mOnSaveCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
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

    oPutRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Put Request Error";
    };

  },

  put: function(sObjectStoreName, dItem, mOnSaveCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    var oPutRequest = oStore.put(dItem);

    oPutRequest.onsuccess = function(oEvent) {
      mOnSaveCallback.call(self, oEvent.target.result);
    };

    oPutRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Put Request Error";
    };

  },


  putList: function(sObjectStoreName, lItems, mOnSaveCallback) {
    var self = this;

    var lAllId = new Array();
    var p = 0;
    for(var i = 0, dItem; dItem = lItems[i]; i++){
      self.put(sObjectStoreName, dItem, function(iId){
        p+=1;

        lAllId.push(iId);

        if(p === lItems.length){
          console.log("dede");
          console.log(lAllId);
          mOnSaveCallback.call(self, lAllId);
        }
      });
    }
  },

  putUniqueKeyword: function(sObjectStoreName, dItem, mOnSaveCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    var oPutRequest = oStore.put(dItem);

    oPutRequest.onsuccess = function(oEvent) {
      mOnSaveCallback.call(self, oEvent.target.result);
    };

    oPutRequest.onerror = function(oEvent){
      // console.error(oEvent);
      // console.error(this);
      if(this['errorCode'] === 4){
        // uniquiness unsatisfied
        // TODO(rmoutard): use
        // webkitErrorMessage: "Unable to add key to index 'sKeyword': at least one key does not satisfy the uniqueness requirements."
        // to get the right key.
        var oTransaction = self._oDb.transaction([sObjectStoreName],
        "readwrite");
        var oStore =  oTransaction.objectStore(sObjectStoreName);
        var oIndex = oStore.index('sKeyword');

        // Get the requested record in the store.
        var oFindRequest = oIndex.get(dItem['sKeyword']);
        console.log(dItem['sKeyword'] + " already exists it will be updated");
        oFindRequest.onsuccess = function(oEvent) {
          var oResult = oEvent.target.result;
          // If there was no result, it will send back null.
          console.log(dItem['sKeyword'] + " had an id:" + dItem['id'] );
          dItem['id'] = oResult['id'];
          dItem['lReferringStoriesId'] = dItem['lReferringStoriesId'].concat(oResult['lReferringStoriesId']);
          dItem['lReferringVisitItemsId'] = dItem['lReferringVisitItemsId'].concat(oResult['lReferringVisitItemsId']);

          var oSecondPutRequest = oStore.put(dItem);

          oSecondPutRequest.onsuccess = function(oEvent) {
            mOnSaveCallback.call(self, oEvent.target.result);
          };

          oSecondPutRequest.onerror = function(oEvent) {
            console.error("can't put: " + dItem);
          };

        };

        oFindRequest.onerror = function(oEvent) {
          console.error(oEvent);
          console.error(this);
          console.error("can't find: " + dItem['sKeyword']);
        };
      }
    };
  },

  AputList: function(sObjectStoreName, lItems, mOnSaveCallback) {
    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    for(var i = 0; i < lItems.length; i++){
      var dItem = lItems[i];
      var oPutRequest = oStore.put(dItem);

      oPutRequest.onsuccess = function(oEvent) {
        console.log('pp');
        // mOnSaveCallback.call(self, oEvent.target.result);
      };

      oPutRequest.onerror = function(oEvent){
        console.error("Can't open the database");
        console.error(oEvent);
        console.error(this);
        throw "Put Request Error - AputList";
      };

    }

  },


  update : function(sObjectStoreName, sId, dItem, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    // Define the index.
    var oIndex = oStore.index('id');

    // Define the Range.
    var oKeyRange = webkitIDBKeyRange.only(sId);
    var oCursorRequest = oIndex.openCursor(oKeyRange);
    oCursorRequest.onsuccess = function(oEvent) {
      var oResult = oEvent.target.result;

      // End of the list of results.
      if (!oResult) {
        // There is no entry that corresponds to your id. Can not be updated.
        mResultElementCallback.call(self);
        return;
      }
      else {
        var oUpdateRequest = this.update(dItem);
        oUpdateRequest.onsuccess = function(oEvent){
          mResultElementCallback.call(self, oEvent.target.result);
          return;
        };
        oUpdateRequest.onerror = function(oEvent){
          console.log("can not update your entry");
          console.log(oEvent);
          throw "Update Request Error";
        };
      }
    };


    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - update";
    };


  },

  delete: function(sObjectStoreName, oId, mOnDeleteCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
        "readwrite");
    var oStore = oTransaction.objectStore(sObjectStoreName);

    var oDeleteRequest = oStore.delete(oId);

    oDeleteRequest.onsuccess = function(oEvent) {
      mOnDeleteCallback.call(self);
    };

    oDeleteRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Delete Request Error";
    };

  },

  purge: function(sObjectStoreName, mResultElementCallback) {
    var self = this;

    var oTransaction = this._oDb.transaction([sObjectStoreName],
      "readwrite");
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

    oCursorRequest.onerror = function(oEvent){
      console.error("Can't open the database");
      console.error(oEvent);
      console.error(this);
      throw "Cursor Request Error - purge";
    };

  },

});
