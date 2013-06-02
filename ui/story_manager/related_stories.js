'use strict'

Cotton.UI.StoryManager.RelatedStories = Class.extend({

  _lTabsStickers : null,

  init : function(lRelatedStories, oDispatcher){

    this._$related_stories = $('<div class="ct-other_stories"></div>');
    this._lRelatedStickers = [];

    if (lRelatedStories && lRelatedStories.length > 0){
      for (var i=0, oStory; oStory = lRelatedStories[i]; i++){
        var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, oDispatcher, 'relatedStory');
        this._lRelatedStickers.push(oSticker.$());
      }
      this._$related_stories.append(
        this._lRelatedStickers
      );
    }

  },

  $ : function(){
    return this._$related_stories;
  }
});