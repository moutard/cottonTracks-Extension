'use strict';

/**
 * World class representing the whole interface.
 * Represents the View in a MVC pattern.
 */
Cotton.UI.World = Class.extend({
  /**
   * Story container
   */
  _oSideMenu : null,

  /**
   * @constructor
   */
  init : function() {
    var self = this;
    chrome.extension.sendMessage({action: "pass_background_image"}, function(response) {
      $('#blur_target').css('background-image',"url("+response.src+")");
      $('body').blurjs({
          source: '#blur_target',
          radius: 15,
          overlay: 'rgba(0,0,0,0.05)'
      });
    });
    $(document).ready(function() {
      $("#blur_target").delay(100).fadeOut(800);
      $('.ct-menu').delay(200).animate({left: '+=250',}, 300, function(){});
    });
  },

  createStory : function(lVisitItems){
    _.each(lVisitItems,function(oVisitItem){
      var oItem = new Cotton.UI.Story.Item.Element(oVisitItem);
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
