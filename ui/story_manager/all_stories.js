'use strict'

Cotton.UI.StoryManager.AllStories = Class.extend({

  init : function(oDispatcher){
    var self = this;
    this._lAllStories = [];
    this._iMaxStories = 120;
    this._bMoreStories = false;
    this._lStickers = [];
    this._oDispatcher = oDispatcher;
    this._$all_stories = $('<div class="ct-other_stories"></div>');
    this._$nothing_title = $('<h2>You don\'t have any story yet :( Start exploring deeper a subject to see stories appear here</h2>');
    var oDate = new Date();
    this._fDate = oDate.getTime();

    this.getMoreStories();
    this._oDispatcher.subscribe('more_all_stories', this, function(dArguments){
      this.addMoreStories(dArguments['stories_to_add'],
        dArguments['more_stories_to_add']);
    });

    this._oDispatcher.subscribe('enter_story', this, function(dArguments){
      this._oDispatcher.unsubscribe('more_all_stories', this);
    });

    $(window).scroll(function(){
      if (self._bMoreStories
        && self._iMaxStories <= self._lAllStories.length
        && !self._$all_stories.hasClass('hidden')
        && $(document).height() - $(window).scrollTop() <= $(window).height() + 600){
          self._iMaxStories += 120;
          self.getMoreStories();
      }
    });
  },

  $ : function(){
    return this._$all_stories;
  },

  getMoreStories : function(){
    this._oDispatcher.publish('get_more_all_stories',
      {
        'iStart': this._lAllStories.length,
        'fDate': this._fDate
      }
    );
  },

  addMoreStories : function(lStories, bMoreStories){
    this._bMoreStories = bMoreStories;
    lStories = (lStories) ? lStories : [];
    this._lAllStories = this._lAllStories.concat(lStories);
    if (this._lAllStories.length === 0 && !bMoreStories){
      this._$all_stories.append(
        this._$nothing_title
      );
    } else if (lStories && lStories.length > 0){
      this._fDate = lStories[lStories.length - 1].lastVisitTime();
      for (var i=0, oStory; oStory = lStories[i]; i++){
        var oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory, this._oDispatcher, 'relatedStory');
        this._lStickers.push(oSticker.$());
      }
      this._$all_stories.append(
        this._lStickers
      );
      if (this._lAllStories.length < this._iMaxStories ){
        if (lStories && lStories.length > 0){
          this._fDate = lStories[lStories.length-1].lastVisitTime();
        }
        this.getMoreStories();
      }
    } else if (lStories && lStories.length === 0){
      this._fDate -= 100000000;
      this.getMoreStories();
    }
  }
});