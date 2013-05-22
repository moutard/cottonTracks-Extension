'use strict'

Cotton.UI.StoryManager.Manager = Class.extend({

  init: function(oStory, lStoriesInTabs, oDispatcher){
    var self = this;
    this._oStory = oStory;
    this._lStoriesInTabs = lStoriesInTabs;
    this._oDispatcher = oDispatcher;
    this._oTopbar = new Cotton.UI.StoryManager.Topbar(this._oDispatcher);
    this._lOtherStickers = [];

    this._$manager = $('<div class="ct-stories_manager"></div>');
    this._$stories_container = $('<div class="ct-stories_container"></div>');
    this._$main_story = $('<div class="ct-main_story"></div>');
    this._$main_title = $('<h1>Story from last tab</h1>');
    this._$other_stories = $('<div class="ct-other_stories"></div>');
    this._$other_title = $('<h1>Stories from other open tabs</h1>');

    this._oDispatcher.subscribe('search_stories', this, function(dArguments){
      this._sQuery = dArguments['searchWords'].join(' ');
    });

    this._$manager.append(this._oTopbar.$(),
      this._$stories_container.append(
        this._$main_story.append(
          this._$main_title
        ),
        this._$other_stories.append(
          this._$other_title
        )
      )
    );

    $(window).resize(function(){
      self.centerTop();
    });

    this.placeStory(oStory);
    this.placeStoriesInTabs(lStoriesInTabs);
  },

  $: function(){
    return this._$manager;
  },

  topbar: function(){
    return this._oTopbar;
  },

  placeStory: function(oStory){
    if (oStory){
      this._oStorySticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
    }
    this._$main_story.append(this._oStorySticker.$());
  },

  placeStoriesInTabs: function(lStoriesInTabs){
    for (var i=0, oStory; oStory = lStoriesInTabs[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
      this._lOtherStickers.push(oSticker.$());
    }
    this._$other_stories.append(this._lOtherStickers);
  },

  centerTop: function(){
    if ($(window).height() > 570 + 42){
      var iMargin = 42 + ($(window).height() - (570 + 42))/2;
      this._$stories_container.css('margin-top', iMargin + "px");
    } else {
      this._$stories_container.css('margin-top', '42px');
    }
  },

  refresh: function(lStories){
    this._$stories_container.empty();
    this._$search_results_title = (lStories.length > 0) ?
    $('<h1>Search Results for <span class=query>'+ this._sQuery +'</span></h1>') :
    $('<h1>No Result for <span class=query>'+ this._sQuery +'</span> :(</h1>');
    this._lStickers = [];
    for (var i = 0, oStory; oStory = lStories[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
      this._lStickers.push(oSticker.$());
    }
    this._$stories_container.append(this._$search_results_title, this._lStickers);
  }

});