'use strict';

/**
 * World class representing the whole interface.
 * Represents the View in a MVC pattern.
 */
Cotton.UI.World = Class.extend({
  /**
   * Lightyear Application
   */
  _oLightyear : null,

  /**
   * {DOM} current element that grab the whole page. (body)
   */
  _$world : null,

  /**
   * {Cotton.UI.Story.Element} oStoryElement
   */
  _oStoryElement : null,

  /**
   * {Cotton.UI.SideBar} oSideBar
   */
  _oSideMenu : null,

  /**
   * @param {Cotton.Application.Lightyear} oApplication
   * @param {Cotton.Core.Messenger} oMessenger
   */
  init : function(oApplication, oMessenger, oDispatcher, $dom_world) {
    var self = this;
    this._oLightyear = oApplication;
    this._oDispatcher = oDispatcher;

    this._$world = $dom_world || $('.ct').click(function(event){
      if (event.target === $(".ct-items_container")[0]
      || event.target  === $(".ct-story")[0]
      ){
        Cotton.ANALYTICS.backToPage('related background');
        window.history.back();
      } else if (event.target  === $(".ct-related")[0]){
        Cotton.ANALYTICS.backToPage('story background');
        window.history.back();
      } else if (event.target  === $(".ct-stories_manager")[0]
      || event.target  === $(".ct-main_story_container")[0]
      || event.target  === $(".ct-story_infos")[0]
      || event.target  === $(".ct-stories_container")[0]
      || event.target  === $(".ct-other_stories")[0]
      || event.target  === $(".ct-main_story")[0]){
        Cotton.ANALYTICS.backToPage('manager background');
        window.history.back();
      }
    });
    this._$temporary_background = $('#blur_target');

    oMessenger.sendMessage({
      'action': 'pass_background_screenshot'
    }, function(response) {
      //set background image and blur it
      // Use a temporary div that will be filled with the background.
      if (response['src'] && response['src'] !== undefined){
        self._$temporary_background.css(
          'background-image',
          "url(" + response['src'] + ")"
        );
        $('body').blurjs({
          'source': '#blur_target',
          'radius': 15,
          'overlay': 'rgba(0,0,0,0.4)'
        });
        setTimeout(function(){
          self._$temporary_background.remove();
        }, 1000);
        // progressive blur effect
        setTimeout(function(){
          self._$temporary_background.addClass('hidden_background');
        }, 200);
      } else {
        $('body').addClass('plain');
      }
    });
  },

  $ : function () {
    return this._$world;
  },

  storyElement : function() {
    return this._oStoryElement;
  },

  sideMenu : function() {
    return this._oSidebar;
  },

  lightyear : function() {
    return this._oLightyear;
  },

  recycleItem : function(oHistoryItem) {
    this._oStoryElement.recycleItem(oHistoryItem);
  },

  recycleMenu : function(oStory) {
    this._oSideMenu.recycle(oStory);
  },

  updateManager : function(oStory, oHistoryItem, lStoriesInTabs, lRelatedStories) {
    this._oManager = null;
    this._oManager = new Cotton.UI.StoryManager.Manager(oStory, oHistoryItem, lStoriesInTabs, lRelatedStories, this._oDispatcher);
    this._$world.append(this._oManager.$());
    this._oManager.centerTop();
    this._oManager.topbar().show();
  },

  clearAll: function(){
    this.$().empty();
  },

  /**
   * @param {Cotton.Model.Story} oStory :
   *  the story have to be filled with all the historyItems so it can be display.
   */
  updateStory : function(oStory) {
    this._$spacer = $('<div class="ct-spacer"></div>');
    this._$world.append(this._$spacer);
    this._oStoryElement = new Cotton.UI.Story.Element(oStory, this._oDispatcher);
    this._$world.append(this._oStoryElement.$());
  },

  /**
   * @param {Cotton.Model.Story} oStory :
   *  the story can be just with the title and the image.
   */
  updateMenu : function(oStory, iNumberOfRelated) {
      this._oSideMenu = new Cotton.UI.SideMenu.Menu(oStory, this._oDispatcher, iNumberOfRelated);
      this._$world.append(this._oSideMenu.$());
      this._oSideMenu.slideIn();
  },

  relatedStories : function(lStories){
    this._oStoryElement.hide();
    this._oRelatedStories = new Cotton.UI.RelatedStories.Stories(lStories, this._oDispatcher);
    this._$world.append(this._oRelatedStories.$())
  },

  refreshRelatedStories : function(lStories){
    this._oRelatedStories.refresh(lStories);
  },

  refreshManager : function(lSearchResultStories){
    this._oManager.refresh(lSearchResultStories);
  }

});
