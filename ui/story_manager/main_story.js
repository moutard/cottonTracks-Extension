'use strict'

Cotton.UI.StoryManager.MainStory = Class.extend({

  init: function(oStory, oHistoryItem, oDispatcher){
    var self = this;
    this._oDispatcher = oDispatcher;

    this._$main_story = $('<div class="ct-main_story"></div>');
    this._$main_title = $('<h1>Story from last tab</h1>');
    this._$main_story_container = $('<div class="ct-main_story_container"></div>');
    this._$main_story_infos = $('<div class="ct-story_infos"></div>');
    this._$https_title = $('<h2>https pages are not parsed by cottonTracks. (a whitelisting feature will be implemented in the future)<br>You can still explore all your stories or use the search tool</h2>')
    this.placeStory(oStory, oHistoryItem);

    this._oDispatcher.subscribe('story:deleted', this, function(dArguments){
      if (dArguments['main_story']){
        this._$main_story.hide(200, function(){
          $(this).addClass('hidden');
        });
      }
    });
  },

  $: function(){
    return this._$main_story;
  },

  placeStory: function(oStory, oHistoryItem){
    if (oStory && oStory.id() === -1){
      // https page
      this._$main_story.append(
        this._$https_title
      );
    } else if (oStory){
      this._oStorySticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
      this._$main_story_name = $('<h2>Open Story</h2><h1>' + oStory.title() + '</h1>');
      if (oHistoryItem){
        this._$history_item_name = $('<h2>Viewing the page</h2><h1>' + oHistoryItem.title() + '</h1>');
      }
      this._$main_story.append(
        this._$main_title,
        this._$main_story_container.append(
          this._oStorySticker.$(),
          this._$main_story_infos.append(
            this._$main_story_name,
            this._$history_item_name
          )
        )
      );
    }
  },

});