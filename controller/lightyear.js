'use strict';
/**
 * Controller
 *
 * Inspired by MVC pattern.
 *
 * Handles DB, and UI.
 *
 */
Cotton.Controllers.Lightyear = Class.extend({

  /**
   * Global Store, that allow controller to make call to
   * the database. So it Contains 'historyItems', 'stories' and 'searchKeywords'.
   */
  _oDatabase : null,

  /**
   * Sender for handle core message. (Chrome message)
   */
  _oSender : null,

  /**
   * Dispatcher that allows two diffents part of the product to communicate
   * together.
   */
  _oDispatcher : null,

  /**
   * Global view, contains the Menu, the StoryContainer.
   * UI elements act as their own controllers.
   */
  _oWorld : null,

  /**
   * state of World creation
   */
  _bWorldReady : null,

  /**
   * Triggered storyId
   **/
  _iStoryId : null,

  /**
   * Triggered story
   **/
  _oStory : null,

  /**
   * list of HistoryItems in the triggered story
   **/
  _lHistoryItems : null,

  /**
   * 
   */
  init : function(oSender){

    var self = this;
    LOG && console.log("Controller Lightyear - init -");
    this._oSender = oSender;
    this._oDispatcher = new Cotton.Messaging.Dispatcher();

    // On item removal
    this._oDispatcher.subscribe("item:delete", this, function(dArguments){
      self.deleteItem(dArguments['id']);
    });

    // On getContent
    this._oDispatcher.subscribe("item:get_content", this, function(dArguments){
      chrome.tabs.create({
        "url" : dArguments['url'],
        "active" : false
      }, function(tab){
        chrome.extension.sendMessage({
          'action': "get_content_tab",
          'params': {
            'tab_id': tab.id
          }
        });
      });
    });
    this._oDispatcher.subscribe("refresh_item", this, function(dArguments){
      self.recycleItem(dArguments['id']);
      self.recycleMenu();
    });

    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
    }, function() {
      self._oSender.sendMessage({
        'action': 'get_trigger_story'
      }, function(response){
        self._iStoryId = response['trigger_id'];
        self._oDatabase.find('stories', 'id', self._iStoryId, function(oStory) {
          self._oStory = oStory;
          // In this case the world is ready before the story has loaded.
          if (self._bWorldReady) {
            self._oWorld.updateMenu(oStory);
          }
          // FIXME(rmoutard) : only load 10 elements at each time.
          self._oDatabase.findGroup('historyItems', 'id', oStory.historyItemsId(),
          function(lHistoryItems) {
            self._oStory.setHistoryItems(lHistoryItems);
            if (self._bWorldReady) {
              self._oWorld.updateMenu(oStory);
              self._oWorld.updateStory(oStory);
              self._bStoryReady = true;
            }
          });
        });
      });
    });

    $(window).ready(function(){
      self._oWorld = new Cotton.UI.World(self, oSender, self._oDispatcher);
      self._bWorldReady = true;
      // In this case the story is ready before the world.
      if (self._bStoryReady) {
        self._oWorld.updateMenu(self._oStory);
        self._oWorld.updateStory(self._oStory);
      }
    });

  },

  database : function(){
    return this._oDatabase;
  },

  story : function() {
    return this._oStory;
  },

  deleteItem : function(sHistoryItemId){
    var self = this;
    Cotton.DB.Stories.removeHistoryItemInStory(
      self._oDatabase, self._oStory.id(), sHistoryItemId);
  },

  recycleItem : function(sHistoryItemId){
    var self = this;
    this._oDatabase.find('historyItems', 'id', sHistoryItemId, function(oHistoryItem){
      self._oWorld.recycleItem(oHistoryItem);
    });
  },

  recycleMenu : function(){
    var self = this;
    if (!this._oStory.featuredImage() || this._oStory.featuredImage() === ""){
      this._oDatabase.find('stories', 'id', this._oStory.id(), function(oStory){
        if (oStory.featuredImage() && oStory.featuredImage() !== ""){
          self._oStory = oStory;
          self._oWorld.recycleMenu(oStory);
        }
      });
    }
  }

});

var oSender = new Cotton.Core.Chrome.Sender();
Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear(oSender);
