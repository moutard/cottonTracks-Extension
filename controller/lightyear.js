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
   * @constructor
   */
  init : function(){

    var self = this;
    LOG && console.log("Controller - init -");
    
    self._oStore = new Cotton.DB.StoreIndexedDB('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS,
    }, function() {
      self._oStore.getLast('stories', 'fLastVisitTime', function(oLastStory) {
        DEBUG && console.debug(oLastStory);
        return oLastStory;
      });
    });

  },

});

Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear();
