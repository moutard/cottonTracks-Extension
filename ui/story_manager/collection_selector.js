'use strict'

Cotton.UI.StoryManager.CollectionSelector = Class.extend({

  init : function(lStoriesInTabs, lRelatedStories, oDispatcher){
    var self = this;
    this._oDispatcher = oDispatcher;
    this._$collection_selector = $('<div class="ct-collection_selector"></div>');
    this._$other_tabs_selector = $('<h1>Stories from open tabs</h1>').click(function(){
      self._oDispatcher.publish('change_collection', {'collection' : 'tabs'});
      self.changeSelector($(this));
    });
    this._$related_selector = $('<h1>Related Stories</h1>').click(function(){
      self._oDispatcher.publish('change_collection', {'collection' : 'related'});
      self.changeSelector($(this));
    });
    this._$all_selector = $('<h1>All Stories</h1>').click(function(){
      self._oDispatcher.publish('change_collection', {'collection' : 'all'});
      self.changeSelector($(this));
    });
    var bSelected = false;

    if (lRelatedStories && lRelatedStories.length > 0){
      this._$collection_selector.append(this._$related_selector.addClass('selected'));
      bSelected = true;
    }
    if (lStoriesInTabs && lStoriesInTabs.length > 0){
      if (!bSelected){
        this._$other_tabs_selector.addClass('selected');
        bSelected = true;
      }
      this._$collection_selector.append(this._$other_tabs_selector);
    }
    if (!bSelected){
     this._$related_selector.addClass('selected');
     bSelected = true;
    }
    this._$collection_selector.append(this._$all_selector);

  },

  $ : function(){
    return this._$collection_selector;
  },

  changeSelector : function($selector){
    this._$other_tabs_selector.removeClass('selected');
    this._$related_selector.removeClass('selected');
    this._$all_selector.removeClass('selected');
    $selector.addClass('selected');
  }

});