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
   * the database. So it Contains 'visitItems' and 'stories'.
   */
  _oStore : null,

  /**
   * "View" in MVC pattern. Global view, contains the stickybar, the homepage.
   */
  _oWorld : null,
    
  /**
   * @constructor
   */
  init : function(){

    var self = this;
    LOG && console.log("Controller - init -");

    $(window).ready(function(){
      Cotton.UI.oWorld = self._oWorld = new Cotton.UI.World();
    });

    self._oStore = new Cotton.DB.StoreIndexedDB('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      self._oStore.getLast('stories', 'fLastVisitTime', function(oLastStory) {
        DEBUG && console.debug(oLastStory);
        DEBUG && console.debug(oLastStory.id());
        self._oStore.findGroup('visitItems', 'id', oLastStory.visitItemsId(), function(lVisitItems) {
		  DEBUG && console.debug(lVisitItems);
		  DEBUG && console.debug(lVisitItems[0].storyId());
		});
      });
    });
  },
});

Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear();
