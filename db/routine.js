'use strict';

Cotton.DB.Routine = Class.extend({

  _oStore : null,

  init : function(oStore) {
    var self = this;
    self._oStore = oStore;
  },

  updateSearchKeywords : function() {
    var self = this;
    var lKeywordsAndId = [];

    self._oStore.getList('visitItems', function(lVisitItems){
      _.each(lVisitItems, function(oVisitItem){
        _.each(oVisitItem.searchKeywords(), function(sKeyword){
          var oKeywordAndId = {
              'sKeyword': sKeyword,
              'iVisitItemId' : oVisitItem.id()
          };
          lKeywordsAndId.push(oKeywordAndId);
        })
      });
      console.log(lKeywordsAndId);
      self.updateOneSearchKeyword(lKeywordsAndId, 0);
    });
  },

  updateOneSearchKeyword : function(lKeywordsAndId, i){
    var self = this;

    var _i = i;
    var oKeywordAndId = lKeywordsAndId[_i];
    if(oKeywordAndId){
      self._oStore.find('searchKeywords', 'sKeyword', oKeywordAndId['sKeyword'], function(oSearchKeyword){
        // If not find, oSearchKeyword is null.
        if(!oSearchKeyword) {
          oSearchKeyword = new Cotton.Model.SearchKeyword(oKeywordAndId['sKeyword']);
        }

        oSearchKeyword.addReferringVisitItemId(oKeywordAndId['iVisitItemId']);

        self._oStore.put('searchKeywords', oSearchKeyword, function(iId){
          // Becarefull with asynchronous.
          console.log('update id :' + iId + 'i:' + _i);
          self.updateOneSearchKeyword(lKeywordsAndId, _i+1);
        });
      });
    }
  },


});