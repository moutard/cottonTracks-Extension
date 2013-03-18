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
   * Story container
   */
  _$storyContainer : null,

  /**
   * @constructor
   */
  init : function(oApplication) {
    var self = this;
    this._oLightyear = oApplication;
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

  buildStory : function(lHistoryItems) {
    var self = this;
    // Initialize isotope grid view
    self.initPlaceItems();
    for (var i = 0, iLength = lHistoryItems.length; i < iLength; i++){
      var oHistoryItem = lHistoryItems[i];
      var oItem = new Cotton.UI.Story.Item.Element(oHistoryItem,
        self._$storyContainer, self);
    }
    // count items through dom classes to set filters counts
    self.countItems();
    $('.ct-filter').click(function(){
      var selector = $(this).attr('data-filter');
      $('.ct-story_container').isotope({ 'filter': selector });
    return false;
    });
  },

  buildMenu : function(oStory){
    var oMenu = new Cotton.UI.SideMenu.Menu(oStory, this);
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
  },

  lightyear : function(){
    return this._oLightyear;
  }
});
