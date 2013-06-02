'use strict'

Cotton.UI.StoryManager.TabsStories = Class.extend({

  _lTabsStickers : null,

  init : function(lStoriesInTabs, oDispatcher){

    this._$stories_in_tabs = $('<div class="ct-other_stories"></div>');
    this._lTabsStickers = [];

    if (lStoriesInTabs && lStoriesInTabs.length > 0){
      for (var i=0, oStory; oStory = lStoriesInTabs[i]; i++){
        var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, oDispatcher, 'relatedStory');
        this._lTabsStickers.push(oSticker.$());
      }
      this._$stories_in_tabs.append(
        this._lTabsStickers
      );
    }

  },

  $ : function(){
    return this._$stories_in_tabs;
  }
});