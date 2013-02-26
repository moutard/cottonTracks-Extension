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
   * "View" in MVC pattern. Global view, contains the Menu, the StoryContainer
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
			self.buildStory();
    });
  },

	buildStory: function() {
		self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
          'stories' : Cotton.Translators.STORY_TRANSLATORS,
          'visitItems' : Cotton.Translators.VISIT_ITEM_TRANSLATORS
    }, function() {
      self._oDatabase.getLast('stories', 'fLastVisitTime', function(oLastStory) {
        self._oDatabase.findGroup('visitItems', 'id', oLastStory.visitItemsId(), function(lVisitItems) {
		      _.each(lVisitItems,function(oVisitItem){
						var oItem = new Cotton.UI.Story.Item.Element(oVisitItem);
					});
				});
				var oSticker = new Cotton.UI.SideMenu.Menu(oLastStory);
      });
    });
  }
});

Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear();
