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
      $('#blur_target').css('background-image',"url("+response.src+")");
      $('body').blurjs({
          source: '#blur_target',
          radius: 15,
          overlay: 'rgba(0,0,0,0.2)'
      });
    });
    $(document).ready(function() {
      $("#blur_target").delay(100).fadeOut(800);
      $('.ct-menu').delay(200).animate({left: '+=250',}, 300, function(){});
    });
  },

  createStory : function(lVisitItems){
	var self = this;
    _.each(lVisitItems,function(oVisitItem){
      var oItem = new Cotton.UI.Story.Item.Element(oVisitItem, self._$storyContainer);
    });
  },

  createMenu : function(oStory){
    var oMenu = new Cotton.UI.SideMenu.Menu(oStory);
  }
});

// We need an object to communicate via BackBone with the algorithm.
// TODO: Remove this hack.
Cotton.UI.World.COMMUNICATOR = {};
_.extend(Cotton.UI.World.COMMUNICATOR, Backbone.Events);
