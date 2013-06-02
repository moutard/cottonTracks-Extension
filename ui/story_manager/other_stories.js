'use strict'

Cotton.UI.StoryManager.OtherStories = Class.extend({

  init: function(lStoriesInTabs, lRelatedStories, oDispatcher){
    var self = this;
    this._oDispatcher = oDispatcher;
    this._lStoriesInTabs = lStoriesInTabs;
    this._lRelatedStories = lRelatedStories;
    this._$other_stories_container = $('<div class="ct-other_stories_container"></div>');

    this._oCollectionSelector = new Cotton.UI.StoryManager.CollectionSelector(lStoriesInTabs, lRelatedStories, oDispatcher);
    this._$other_stories_container.append(this._oCollectionSelector.$());

    var bSelected = false;
    bSelected = this.placeRelatedStories();
    if (!bSelected){
      bSelected = this.placeStoriesInTabs();
    } if (!bSelected){
      this.placeAllStories();
    }

    this._oDispatcher.subscribe('change_collection', this, function(dArguments){
      this.switchCollection(dArguments['collection']);
    });

  },

  $: function(){
    return this._$other_stories_container;
  },

  placeStoriesInTabs : function(){
    if (this._lStoriesInTabs && this._lStoriesInTabs.length > 0){
      this._oTabsStories = new Cotton.UI.StoryManager.TabsStories(this._lStoriesInTabs, this._oDispatcher);
      this._$other_stories_container.append(this._oTabsStories.$());
      return true;
    } else {
     return false;
    }
  },

  placeRelatedStories : function(){
    if (this._lRelatedStories && this._lRelatedStories.length > 0){
      this._oRelatedStories = new Cotton.UI.StoryManager.RelatedStories(this._lRelatedStories, this._oDispatcher);
      this._$other_stories_container.append(this._oRelatedStories.$());
      return true;
    } else {
      return false;
    }
  },

  placeAllStories : function(){
    this._oDispatcher.publish('all_stories',{});
    this._oAllStories = new Cotton.UI.StoryManager.AllStories(this._oDispatcher);
    this._$other_stories_container.append(this._oAllStories.$());
  },

  switchCollection : function(sCollection){
    this.$().children().addClass('hidden');
    switch(sCollection){
      case 'tabs':
        if (this._oTabsStories){
          this._oTabsStories.$().removeClass('hidden');
        } else {
          this.placeStoriesInTabs();
        }
        break;

      case 'related':
        if (this._oRelatedStories){
          this._oRelatedStories.$().removeClass('hidden');
        } else {
          this.placeRelatedStories();
        }
        break;

      case 'all':
        if (this._oAllStories){
          this._oAllStories.$().removeClass('hidden');
        } else {
          this.placeAllStories();
        }
        break;

      default:
        break;
    }
  }


});