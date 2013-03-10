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

  buildStory : function() {
    var self = this;
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
    }, function() {
	  self = self;
      self._oDatabase.getLast('stories', 'fLastVisitTime', function(oLastStory) {
        self._oDatabase.findGroup('historyItems', 'id', oLastStory.historyItemsId(),
        function(lHistoryItems) {
          // Initialize isotope grid view
          self.initPlaceItems();
          self._oWorld.createStory(lHistoryItems);
          self.countItems();
          $('.ct-filter').click(function(){
            var selector = $(this).attr('data-filter');
            $('.ct-story_container').isotope({ filter: selector });
	        return false;
          });
        });
	    self._oWorld.createMenu(oLastStory);
      });
    });
  },

  countItems: function(){
    var sAllCount = $('.ct-story_item').length;
    $('.all_count').text(sAllCount);
    var sArticlesCount = $('.ct-item-default').length;
    $('.articles_count').text(sArticlesCount);
    var sImagesCount = $('.ct-item-image').length;
    $('.images_count').text(sImagesCount);
    var sVideosCount = $('.ct-item-video').length;
    $('.videos_count').text(sVideosCount);
    var sMapsCount = $('.ct-item-map').length;
    $('.maps_count').text(sMapsCount);
    var sSoundsCount = $('.ct-item-sound').length;
    $('.sounds_count').text(sSoundsCount);
    // ToDo (rkorach) : spécific case for quotes
    var sQuotesCount = $('.ct-item-quote').length;
    $('.quotes_count').text(sQuotesCount);
  },

  initPlaceItems: function(){
    $('.ct-story_container').isotope({
        itemSelector : '.ct-story_item',
        layoutMode : 'fitColumns',
    });
  }

});

Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear();
