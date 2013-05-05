'use strict';

/**
 * Related stories
 */
Cotton.UI.RelatedStories.Stories = Class.extend({

  _$related_container : null,
  _lRelatedStories : null,
  _lStickers : null,

  init : function(lStories, oDispatcher){
    var self = this;
    this._lRelatedStories = lStories
    this._oDispatcher = oDispatcher;
    this._lStickers = [];
    this._$related = $('<div class="ct-related"></div>');
    this._$related_container = $('<div class="ct-related_container"></div>');

    this._oSearch = new Cotton.UI.RelatedStories.Search(oDispatcher);
    this._$title = $('<h2>Related Stories</h2>');
    this._$stories = $('<div class="ct-stories_result"></div>');

    this._$related_container.append(
      this._oSearch.$(),
      this._$title,
      this._$stories
    );

    this.centerTop();

    $(window).resize(function(){
      self.centerTop();
    });

    for (var i=0, oStory; oStory = lStories[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, oDispatcher, 'relatedStory');
      this._lStickers.push(oSticker.$());
    }
    this._$stories.append(this._lStickers);

    oDispatcher.subscribe('back_to_story', this, function(dArguments){
      this._$related.addClass('hidden');
    });
    oDispatcher.subscribe('related_stories', this, function(dArguments){
      this._$related.removeClass('hidden');
    });


    this._$related.append(
      this._$related_container);
  },

  $ : function(){
    return this._$related;
  },

  show : function(){
    this._$related.removeClass('hidden');
  },

  centerTop : function(){
    if ($(window).height() > 490 + 68 + 52 + 40){
      var iMargin = $(window).height() - (490 + 68 + 52 + 40);
      this._$related_container.css('margin-top', iMargin/2 + "px");
    } else {
      this._$related_container.css('margin-top', 0);
    }
  },

  refresh : function(lStories){
    this._lRelatedStories = lStories;
    this._lStickers = [];
    for (var i=0, oStory; oStory = lStories[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
      this._lStickers.push(oSticker.$());
    }
    this._$title.text('Search Results');
    this._$stories.empty().append(this._lStickers);
  }

});