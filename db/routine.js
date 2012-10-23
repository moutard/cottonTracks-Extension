'use strict';

/**
 * Routines update the database according to a CRON. They are launched in the
 * background (maybe the better should be in another worker).
 *
 * Routines can be heavy.
 */

Cotton.DB.Routine = Class.extend({

  _oStore : null,

  /**
   * @constructor
   * {Cotton.DB.Store} :
   * TODO(rmoutard) : Routines could be used in the store of the
   * background controller.
   */
  init : function(oStore) {
    var self = this;
    self._oStore = oStore;
  },

  /**
   * Routine : Update Search Keywords.
   *
   * Accross all the visitItems. For each visitItems compute the search keywords
   * then update the corresponding entry in the database 'searchkeywords'.
   */
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
      self._updateOneSearchKeyword(lKeywordsAndId, 0);
    });
  },

  /**
   * Private method used by the routine updateSearchKeywords.
   *
   * This is a recursive method, because we need to wait that the previous
   * keyword has been updated before find for the other one.
   */
  _updateOneSearchKeyword : function(lKeywordsAndId, i){
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

  /**
   * Routine : Update Search Keywords for stories.
   *
   * Accross all the visitItems. For each visitItems compute the search keywords
   * then update the corresponding entry in the database 'searchkeywords'.
   */
  updateSearchKeywordsForStories : function() {
    var self = this;
    var lKeywordsAndId = [];

    self._oStore.getList('stories', function(lStories){
      _.each(lStories, function(oStory){
        _.each(oStory.searchKeywords(), function(sKeyword){
          var oKeywordAndId = {
              'sKeyword': sKeyword,
              'iStoryId' : oStory.id()
          };
          lKeywordsAndId.push(oKeywordAndId);
        })
      });
      console.log(lKeywordsAndId);
      self._updateOneSearchKeywordForStories(lKeywordsAndId, 0);
    });
  },

  /**
   * Private method used by the routine updateSearchKeywords.
   *
   * This is a recursive method, because we need to wait that the previous
   * keyword has been updated before find for the other one.
   */
  _updateOneSearchKeywordForStories : function(lKeywordsAndId, i){
    var self = this;

    var _i = i;
    var oKeywordAndId = lKeywordsAndId[_i];
    if(oKeywordAndId){
      self._oStore.find('searchKeywords', 'sKeyword', oKeywordAndId['sKeyword'], function(oSearchKeyword){
        // If not find, oSearchKeyword is null.
        if(!oSearchKeyword) {
          oSearchKeyword = new Cotton.Model.SearchKeyword(oKeywordAndId['sKeyword']);
        }

        oSearchKeyword.addReferringStoryId(oKeywordAndId['iStoryId']);

        self._oStore.put('searchKeywords', oSearchKeyword, function(iId){
          // Becarefull with asynchronous.
          console.log('update id :' + iId + 'i:' + _i);
          self._updateOneSearchKeywordForStories(lKeywordsAndId, _i+1);
        });
      });
    }
  },
});
