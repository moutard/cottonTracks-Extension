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
    this._$title = (lStories && lStories.length > 0) ? $('<h2>Related Stories</h2>') : $('<h2>no related stories...</h2>');
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

  showSearch : function(lStories){
    var lStickers = [];
    for (var i=0, oStory; oStory = lStories[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
      lStickers.push(oSticker.$());
    }
    this._$title.text('Search Results');
    this._$stories.empty().append(lStickers);
  },

  exitSearch : function(){
    var self = this;
    var lStickers = [];
    this._$title.text('Related Stories');
    for (var i=0, oStory; oStory = this._lRelatedStories[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
      lStickers.push(oSticker.$());
    }
    this._$stories.empty().append(lStickers);
  }

});