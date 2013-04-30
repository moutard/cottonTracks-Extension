'use strict';

/**
 * Related stories
 */
Cotton.UI.RelatedStories.Stories = Class.extend({

  _$related_container : null,
  _lRelatedStories : null,

  init : function(lStories, oDispatcher){
    var self = this;
    this._lRelatedStories = lStories
    this._$related = $('<div class="ct-related"></div>');
    this._$related_container = $('<div class="ct-related_container"></div>');
    this._$title = $('<h2>Related Stories</h2>');
    this._$related_container.append(this._$title);
    this.centerTop();

    $(window).resize(function(){
      self.centerTop();
    });

    for (var i=0, oStory; oStory = lStories[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, oDispatcher, 'relatedStory');
      this._$related_container.append(oSticker.$());
    }

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
    var iRows = (this._lRelatedStories.length > 3) ? 2 : 1;
    if ($(window).height() > iRows * 242 + 136){
      var iMargin = $(window).height() - (iRows * 242 + 136);
      this._$related_container.css('margin-top', iMargin/2 + "px");
    } else {
      this._$related_container.css('margin-top', 0);
    }
  }

});