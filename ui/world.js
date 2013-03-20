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
   * {DOM} current element that grab the whole page. (body)
   */
  _$world : null,

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
    var self = this;
    this._oLightyear = oApplication;

    // FIXME(rmoutard) : difference between body ct blur target
    this._$world = $('.ct');

    oSender.sendMessage({
      'action': 'pass_background_screenshot'
    }, function(response) {
      //set background image and blur it
      $('#blur_target').css('background-image',"url(" + response.src + ")");
      $('body').blurjs({
          'source': '#blur_target',
          'radius': 15,
          'overlay': 'rgba(0,0,0,0.2)'
      });
    });

    // progressive blur effect
    setTimeout(function(){
      $("#blur_target").addClass('hiddenBackground');
    }, 200);
  },

  $ : function () {
    return this._$world;
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
  },

  /**
   * @param {Cotton.Model.Story} oStory :
   *  the story have to be filled with all the historyItems so it can be display.
   */
  updateStory : function(oStory) {
    this._oStoryElement = new Cotton.UI.Story.Element(oStory, this);
    this._$world.append(this._oStoryElement.$());
    this._oStoryElement.initPlaceItems();
  },

  /**
   * @param {Cotton.Model.Story} oStory :
   *  the story can be just with the title and the image.
   */
  updateMenu : function(oStory) {
    this._oSideMenu = new Cotton.UI.SideMenu.Menu(oStory, this);
    this._$world.append(this._oSideMenu.$());
    this._oSideMenu.slideIn();
  }

});
