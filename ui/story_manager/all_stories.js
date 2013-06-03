'use strict'

Cotton.UI.StoryManager.AllStories = Class.extend({

  init : function(oDispatcher){
    var self = this;
    this._lAllStories = [];
    this._iMaxStories = 120;
    this._lStickers = [];
    this._oDispatcher = oDispatcher;
    this._$all_stories = $('<div class="ct-other_stories"></div>');
    this._$nothing_title = $('<h2>You don\'t have any story yet :( Start exploring deeper a subject to see stories appear here</h2>')

    this.getMoreStories();
    this._oDispatcher.subscribe('more_all_stories', this, function(dArguments){
      this.addMoreStories(dArguments['stories_to_add']);
    });

    $(window).scroll(function(){
      if ($(document).height() - $(window).scrollTop() <= $(window).height() + 600
        && self._iMaxStories === self._lAllStories.length
        && !self._$all_stories.hasClass('hidden')){
          self._iMaxStories += 120;
          self.getMoreStories();
      }
    });
  },

  $ : function(){
    return this._$all_stories;
  },

  getMoreStories : function(){
    this._oDispatcher.publish('get_more_all_stories', {'iStart': this._lAllStories.length + 1});
  },

  addMoreStories : function(lStories){
    this._lAllStories = this._lAllStories.concat(lStories);
    if (this._lAllStories.length === 0){
      this._$all_stories.append(
        this._$nothing_title
      );
    } else if (lStories && lStories.length > 0){
      for (var i=0, oStory; oStory = lStories[i]; i++){
        var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
        this._lStickers.push(oSticker.$());
      }
      this._$all_stories.append(
        this._lStickers
      );
      if ( this._lAllStories.length < this._iMaxStories ){
        this.getMoreStories();
      }
    }
  }
});