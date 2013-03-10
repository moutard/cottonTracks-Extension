'use strict';

Cotton.DB.DatabaseFactory = Class.extend({

  _lDatabaseTypesAvailable : ['indexeddb', 'localstorage'],

  init : function() {
  },

  get : function(sDatabaseType, sDatabaseName, dTranslators, mCallback) {
    var self = this;
    switch (sDatabaseType){

      case 'indexeddb':
        if(_.isEmpty(dTranslators)){
          dTranslators = {
            'stories' : Cotton.Translators.STORY_TRANSLATORS,
            'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
            'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
          };
        }
        //TODO(rmoutard) : put the engine creation here.
        var oDatabase = new Cotton.DB.IndexedDB.Wrapper(sDatabaseName,
          dTranslators,
          function() {
            mCallback();
        });
        // TODO(rmoutard) : extend the wrapper if needed.
        // _.extend(oDatabase, indexeddb_mixin);
        return oDatabase;
        break;

      case 'localstorage':
        if(_.isEmpty(dTranslators)){
          dTranslators = {
            'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
          };
        }
        //TODO(rmoutard) : put the engine creation here.
        var oDatabase = new Cotton.DB.LocalStorage.Wrapper(sDatabaseName,
            dTranslators,
            function() {
              mCallback();
        });
        // TODO(rmoutard) : extend the wrapper if needed.
        //  _.extend(oDatabase, localstorage_mixin);
        return oDatabase;

        break;

      default:
        console.error("The database type" + sDatabaseType + "is not available."
          + "Database types available are : ");
        console.error(self._lDatabaseTypesAvailable);
        break;
    }
  },

  getCt : function(sDatabaseName, dTranslators, mOnReadyCallback) {
    var dIndexesForObjectStoreNames = {};
    _.each(dTranslators, function(lTranslators, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = self._lastTranslator(sObjectStoreName).indexDescriptions();
    });

    var oEngine = new Cotton.DB.IndexedDB.Engine(
        sDatabaseName,
        dIndexesForObjectStoreNames,
        function() {
          var oDatabase = new Cotton.DB.WrapperForEngine(sDatabaseName,
            dTranslators, oEngine, mOnReadyCallback);
          return oDatabase;
    });


  },

  getPool : function() {
    // Create translator collection.
    var oTranslatorsCollection = new Cotton.DB.TranslatorsCollection({
      'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
    });

    // Create engine using translator collection for indexes.
    var oCache = new Cotton.DB.FixedSizeCache('pool', 50);
    // As dbscan2 work directly on dDbRecord and not on the element, we don't
    // need a wrapper here.
    return oCache;
  },
});
