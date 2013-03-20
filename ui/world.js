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
   * {Cotton.UI.Story.Element} oStoryElement
   */
  _oStoryElement : null,

  /**
   * {Cotton.UI.SideBar} oSideBar
   */
  _oSideMenu : null,

  /**
   * @param {Cotton.Application.Lightyear} oApplication
   * @param {Cotton.Core.Chrome.Sender} oSender
   */
  init : function(oApplication, oSender) {

    this._oLightyear = oApplication;

    var oStory = oApplication.getStory();
    this._oStoryElement = new Cotton.UI.Story.Element(oStory, this);
    this._oSideMenu = new Cotton.UI.SideMenu.Menu(oStory, this);

    this._oSideMenu.slideIn();
    oSender.sendMessage({
      'action': 'pass_background_screenshot'
    }, function(response) {
      //set background image and blur it
      $('#blur_target').css('background-image',"url(" + response.src + ")");
      /*$('body').blurjs({
          'source': '#blur_target',
          'radius': 15,
          'overlay': 'rgba(0,0,0,0.2)'
      });*/
    });

    // progressive blur effect
    setTimeout(function(){
      $("#blur_target").addClass('hiddenBackground');
    }, 200);
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

  countItems: function() {
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
  }

});
