'use strict'

Cotton.UI.StoryManager.Manager = Class.extend({

  init: function(oStory, oHistoryItem, lStoriesInTabs, lRelatedStories, oDispatcher){
    var self = this;
    this._oStory = oStory;
    this._lStoriesInTabs = lStoriesInTabs;
    this._oDispatcher = oDispatcher;
    this._oTopbar = new Cotton.UI.StoryManager.Topbar(oDispatcher);
    // this._oSearchStories = new Cotton.UI.StoryManager.SearchStories();
    this._lOtherStickers = [];

    this._$manager = $('<div class="ct-stories_manager"></div>');
    this._$stories_container = $('<div class="ct-stories_container"></div>');

    this._oDispatcher.subscribe('search_stories', this, function(dArguments){
      this._sQuery = dArguments['searchWords'].join(' ');
    });

    this._$manager.append(
      this._oTopbar.$(),
      this._$stories_container
    );

    $(window).resize(function(){
      self.centerTop();
    });

    this._oMainStory = new Cotton.UI.StoryManager.MainStory(oStory, oHistoryItem, oDispatcher);
    this._$stories_container.append(this._oMainStory.$());
    this._oOtherStories = new Cotton.UI.StoryManager.OtherStories(lStoriesInTabs, lRelatedStories, oDispatcher);
    this._$stories_container.append(this._oOtherStories.$());
  },

  $: function(){
    return this._$manager;
  },

  topbar: function(){
    return this._oTopbar;
  },

  centerTop: function(){
    if ($(window).height() > 570 + 42){
      var iMargin = 42 + ($(window).height() - (570 + 42))/2;
      this._$stories_container.css('margin-top', iMargin + "px");
    } else {
      this._$stories_container.css('margin-top', '42px');
    }
  },

  showSearch : function(lStories) {
    if (this._$search_results_title) {
      this._$search_results_title.remove();
      this._$stories_container.children('.ct-sticker').remove();
    }
    this._oMainStory.$().addClass('hidden');
    this._oOtherStories.$().addClass('hidden');
    this._$search_results_title = (lStories.length > 0) ?
    $('<h1>Search Results for <span class=query>'+ this._sQuery +'</span></h1>') :
    $('<h1>No Result for <span class=query>'+ this._sQuery +'</span> :(</h1>');
    this._lStickers = [];
    var iLength = lStories.length;
    for (var i = 0; i < iLength; i++){
      var oStory = lStories[i];
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
      this._lStickers.push(oSticker.$());
    }
    this._$stories_container.append(this._$search_results_title, this._lStickers);
  },

  exitSearch : function() {
    if (this._$search_results_title) {
      this._$search_results_title.remove();
      this._$stories_container.children('.ct-sticker').remove();
      this._oMainStory.$().removeClass('hidden');
      this._oOtherStories.$().removeClass('hidden');
    }
  }

});