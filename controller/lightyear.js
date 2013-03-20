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
   * Sender
   */
  _oSender : null,

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
   * @constructor
   */
  init : function(oSender){

    var self = this;
    LOG && console.log("Controller Lightyear - init -");
    this._oSender = oSender;

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
          self._oDatabase.findGroup('historyItems', 'id', oStory.historyItemsId(),
          function(lHistoryItems) {
            self._lHistoryItems = lHistoryItems;
            self.buildMenuFromWorld();
            self.buildStoryFromWorld();
          });
        });
      });
    });

    $(window).ready(function(){
      self._oWorld = new Cotton.UI.World(self, oSender);
      self._bWorldReady = true;
    });
  },

  buildStoryFromWorld : function(){
    if (this._lHistoryItems && this._bWorldReady) {
      this._oWorld.buildStory(this._lHistoryItems)
    }
  },

  buildMenuFromWorld : function(){
    if (this._oStory && this._bWorldReady) {
      this._oWorld.buildMenu(this._oStory)
    }
  },

  database : function(){
    return this._oDatabase;
  },

  historyItems : function(){
    return this._lHistoryItems;
  },

  getStory : function() {
    return this._oStory;
  },

});

var oSender = new Cotton.Core.Chrome.Sender();
Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear(oSender);
