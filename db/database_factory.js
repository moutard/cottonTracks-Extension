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
            'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
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
            'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
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
});
