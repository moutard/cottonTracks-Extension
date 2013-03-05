'use strict';

Cotton.DB.Cache = Class.extend({
  init : function(sDatabaseName, dTranslators, mOnReadyCallback) {
    var self = this;
    this._dTranslators = dTranslators;

    var dIndexesForObjectStoreNames = {};
    _.each(dTranslators, function(lTranslators, sObjectStoreName) {
      dIndexesForObjectStoreNames[sObjectStoreName] = self._lastTranslator(sObjectStoreName).indexDescriptions();
    });

    // TODO(rmoutard) : create an engine for localStorage.
    this._oEngine = null;
  },
  get : function(){
    return JSON.parse(localStorage.getItem('ct-stories-cache'));
  },
  set : function(llStories){
    localStorage.setItem('ct-stories-cache', JSON.stringify(llStories));
  },
  empty : function(){
    localStorage.removeItem('ct-stories-cache');
  },
});
