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
    chrome.extension.sendMessage({action: "pass_background_image"}, function(response) {
      //set background image and blur it
      $('#blur_target').css('background-image',"url("+response.src+")");
      $('body').blurjs({
          source: '#blur_target',
          radius: 15,
          overlay: 'rgba(0,0,0,0.2)'
      });
    });

    // progressive blur effect
    $(document).ready(function() {
      $("#blur_target").delay(100).fadeOut(800);
      $('.ct-menu').delay(200).animate({left: '+=250',}, 300, function(){});
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
  }
});
