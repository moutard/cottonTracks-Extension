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
    this.centerTop();

    $(window).resize(function(){
      self.centerTop();
    });

    for (var i=0, oStory; oStory = lStories[i]; i++){
      var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, oDispatcher, 'relatedStory');
      this._$related_container.append(oSticker.$());
    }

    this._$related.append(this._$related_container);
  },

  $ : function(){
    return this._$related;
  },

  show : function(){
    this._$related.removeClass('hidden');
  },

  centerTop : function(){
    var iRows = (this._lRelatedStories.length > 3) ? 2 : 1;
    if ($(window).height() > iRows * 242){
      var iMargin = $(window).height() - iRows * 242;
      this._$related_container.css('margin-top', iMargin/2 + "px");
    } else {
      this._$related_container.css('margin-top', 0);
    }
  }

});