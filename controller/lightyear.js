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
   * "Model" in MVC pattern. Global Store, that allow controller to make call to
   * the database. So it Contains 'historyItems' and 'stories'.
   */
  _oDatabase : null,

  /**
   * "View" in MVC pattern. Global view, contains the Menu, the StoryContainer
   */
  _oWorld : null,

  /**
   * Triggered story
   **/
  _iStoryId : null,

  /**
   * @constructor
   */
  init : function(){

    var self = this;
    LOG && console.log("Controller - init -");

    $(window).ready(function(){
      Cotton.UI.WORLD = self._oWorld = new Cotton.UI.World();
      chrome.extension.sendMessage({
        'action': 'get_trigger_story'
      }, function(response){
        self._oWorld.buildStory(response['trigger_id']);
      });
    });
  },

});

Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear();
