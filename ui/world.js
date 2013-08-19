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

    this._$world = $dom_world || $('.ct');
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
      var self = this;
      this._oSideMenu = new Cotton.UI.SideMenu.Menu(oStory, this._oDispatcher, iNumberOfRelated);
      // FIXME(rmoutard or rkorach): the append shouldn't be there.
      this._$world.append(this._oSideMenu.$());
      // Make sure the oSideMenu has been append.
      setTimeout(function(){self._oSideMenu.slideIn();}, 0);
  },

  relatedStories : function(lStories){
    this._oStoryElement.hide();
    if (this._oRelatedStories) {
      this._oRelatedStories.$().remove();
    }
    this._oRelatedStories = new Cotton.UI.RelatedStories.Stories(lStories, this._oDispatcher);
    this._$world.append(this._oRelatedStories.$())
  },

  showSearchRelated : function(lSearchResultStories){
    this._oRelatedStories.showSearch(lSearchResultStories);
  },

  exitSearchRelated : function() {
    this._oRelatedStories.exitSearch();
  },

  showSearchManager : function(lSearchResultStories){
    this._oManager.showSearch(lSearchResultStories);
  },

  exitSearchManager : function() {
    this._oManager.exitSearch();
  }

});
