'use strict';

/**
 * World class representing the whole interface.
 * Represents the View in a MVC pattern.
 */
Cotton.UI.World = Class.extend({
  /**
   * Story container
   */
  _$storyContainer : null,

  /**
   * @constructor
   */
  init : function() {
    var self = this;
    this._$storyContainer = $(".ct-story_container");
    chrome.extension.sendMessage({
      'action': 'pass_background_screenshot'
    }, function(response) {
      //set background image and blur it
      $('#blur_target').css('background-image',"url("+response.src+")");
      $('body').blurjs({
          'source': '#blur_target',
          'radius': 15,
          'overlay': 'rgba(0,0,0,0.2)'
      });
    });

    // progressive blur effect
    $(document).ready(function() {
      $("#blur_target").delay(100).fadeOut(800);
      $('.ct-menu').delay(200).animate({left: '+=250',}, 300, function(){});
    });
  },

  buildStory : function(iStoryId) {
    var self = this;
    self._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS
    }, function() {
	  self = self;
      self._oDatabase.find('stories', 'id', iStoryId, function(oStory) {
        self._oDatabase.findGroup('historyItems', 'id', oStory.historyItemsId(),
        function(lHistoryItems) {
          // Initialize isotope grid view
          self.initPlaceItems();
          self.createStory(lHistoryItems);
          self.countItems();
          $('.ct-filter').click(function(){
            var selector = $(this).attr('data-filter');
            $('.ct-story_container').isotope({ 'filter': selector });
	        return false;
          });
        });
        self.createMenu(oStory);
      });
    });
  },

  createStory : function(lHistoryItems){
    var self = this;
    for (var i = 0, iLength = lHistoryItems.length; i < iLength; i++){
      var oHistoryItem = lHistoryItems[i];
      var oItem = new Cotton.UI.Story.Item.Element(oHistoryItem, self._$storyContainer);
    }
  },

  createMenu : function(oStory){
    var oMenu = new Cotton.UI.SideMenu.Menu(oStory);
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
        'itemSelector' : '.ct-story_item',
        'layoutMode' : 'fitColumns',
    });
  }
});
