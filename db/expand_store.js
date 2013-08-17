'use strict';

/**
 * Add usefull function to expand store prototype.
 */

/**
 * Stories
 */
Cotton.DB.Stories = {};

Cotton.DB.Stories.addStories = function(oStore, lStories, mCallBackFunction) {

  DEBUG && console.debug("DB - add stories");
  DEBUG && console.debug(lStories);

  var iLength = lStories.length;
  var iCount = 0;
  var _lStories = [];
  if (iLength === 0 && mCallBackFunction){
    mCallBackFunction(oStore, _lStories);
  }
  for ( var i = 0; i < iLength; i++) {
    // start from the end of the array
    var oStory = lStories[iLength - i - 1];
    oStore.put('stories', oStory, function(iId, _oStory) {
      var _iId = iId;
      _lStories.push(_oStory);
      _oStory.setId(iId);

      Cotton.DB.SearchKeywords.updateSearchKeywordsForOneStory(oStore, _oStory, function() {
        iCount ++;
        if (_oStory.historyItemsId().length === 0 && iCount === iLength && mCallBackFunction){
          // Purge:
          var kLength = _lStories.length;
          for (var k = 0; k < kLength; k++) {
            _lStories[k] = null;
          }
          _lStories = null;
          mCallBackFunction(oStore, _lStories);
        } else {
          for (var j = 0, lIds = _oStory.historyItemsId(), iIdsLength = lIds.length;
            j < iIdsLength; j++) {
  	          var iHistoryItemId = lIds[j];
              oStore.find('historyItems', 'id', iHistoryItemId, function(oHistoryItem){
                oHistoryItem.setStoryId(_iId);
                oStore.put('historyItems', oHistoryItem, function(){});
              });
              if (iCount === iLength && j === iIdsLength - 1 && mCallBackFunction) {

                // Purge:
                var kLength = _lStories.length;
                for (var k = 0; k < kLength; k++) {
                  _lStories[k] = null;
                }
                _lStories = null;
                mCallBackFunction(oStore);
              }
          }
        }
      });
    });
  }
};

Cotton.DB.Stories.removeHistoryItemInStory = function(oStore, iStoryId, iHistoryItemId, mCallBackFunction){
  var bStoryReady, bItemReady;
  oStore.find('stories', 'id', iStoryId, function(oStory){
    oStory.removeHistoryItem(iHistoryItemId);
    oStore.put('stories', oStory, function(){
      bStoryReady = true;
      if (bItemReady && mCallBackFunction){
        mCallBackFunction();
      }
    });
  });
  oStore.find('historyItems', 'id', iHistoryItemId, function(oHistoryItem){
    oHistoryItem.removeStoryId();
    oStore.put('historyItems', oHistoryItem, function(){
      bItemReady = true;
      if (bStoryReady && mCallBackFunction){
        mCallBackFunction();
      }
    });
  });
};

/**
 * ----------------------------------------------------------------------------
 * SearchKeywords
 */
Cotton.DB.SearchKeywords = {};

Cotton.DB.SearchKeywords.updateSearchKeywordsForOneStory = function(oStore, oStory, mCallback){
  var lKeywordsAndId = [];
  var iCount = 0;
  var lKeywordsIds = [];
  var lKeywords = oStory.searchKeywords();
  var iKeywordsLength = lKeywords.length;
  for (var i = 0; i < iKeywordsLength; i++) {
    var sKeyword = lKeywords[i];
    var oSearchKeyword = new Cotton.Model.SearchKeyword(sKeyword);
    oSearchKeyword.addReferringStoryId(oStory.id());
    oStore.putUnique('searchKeywords', oSearchKeyword, function(iId){
      // Be careful with asynchronous.
      lKeywordsIds.push(iId);
      iCount++;
      if (iCount === iKeywordsLength && mCallback) {
        // Purge :
        for (var i = 0; i < iKeywordsLength; i++) {
          lKeywordsIds[i] = null;
        }
        lKeywordsIds = [];
        mCallback();
      }
    });
  }
};
