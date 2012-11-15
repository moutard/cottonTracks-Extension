'use strict';
// (function() {

var _gaq = _gaq || [];

Cotton.Analytics = Class.extend({
  _sAccount : null,
  _oGoogleAnalytics : null,
  _gaq : null,

  init : function() {
    var self = this;
    // self._sAccount = Cotton.Config.Parameters._sAccount;

    self._gaq = _gaq || [];

    if (Cotton.Config.Parameters.bAnalytics === true) {
      _gaq.push([ '_setAccount', 'UA-30134257-1' ]);
      _gaq.push([ '_trackPageview' ]);

      self._oGoogleAnalytics = document.createElement('script');
      self._oGoogleAnalytics.type = 'text/javascript';
      self._oGoogleAnalytics.async = true;
      self._oGoogleAnalytics.src = 'https://ssl.google-analytics.com/ga.js';
      var oScript = document.getElementsByTagName('script')[0];
      oScript.parentNode.insertBefore(self._oGoogleAnalytics, oScript);
    }
  },

  enterStory : function() {
    _gaq.push([ '_trackEvent', 'Story trafic', 'Enter story',
        'Click on sticker' ]);
  },

  deleteStory : function() {
    _gaq.push([ '_trackEvent', 'Story modification', 'delete' ]);
  },

  editStickerOn : function() {
    _gaq.push([ '_trackEvent', 'Story modification', 'Edit on' ]);
  },

  editStickerOff : function() {
    _gaq.push([ '_trackEvent', 'Story modification', 'Edit off' ]);
  },

  changeStoryTitle : function() {
    _gaq.push([ '_trackEvent', 'Story modification', 'Title changed' ]);
  },
  
  changeStoryThumbnail : function() {
    _gaq.push([ '_trackEvent', 'Story modification', 'Thumbnail changed' ]);
  },

  dragStory : function() {
    _gaq.push([ '_trackEvent', 'Story modification', 'Story dragged' ]);
  },

  mergeStory : function() {
    _gaq.push([ '_trackEvent', 'Story modification', 'Story merged' ]);
  },

  scrollWithLeftArrow : function() {
    _gaq.push([ '_trackEvent', 'Hook', 'Browse stories',
        'Left arrow in story selector' ]);
  },

  scrollWithRightArrow : function() {
    _gaq.push([ '_trackEvent', 'Hook', 'Browse stories',
        'Right arrow in story selector' ]);
  },

  scrollStorySelector : function() {
    _gaq.push([ '_trackEvent', 'Hook', 'Browse stories',
        'Scroll in story selector' ]);
  },

  clickDefaultItemTitle : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Item Title Clicked',
        'Default Item' ]);
  },

  clickDefaultItemFeaturedImage : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Item Featured Image Clicked',
        'Default Item' ]);
  },

  clickSearchItemTitle : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Item Title Clicked',
        'Search Item' ]);
  },

  clickSearchItemFeaturedImage : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Item Featured Image Clicked',
        'Search Item' ]);
  },

  viewImageItem : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Image viewed', 'Image Item' ]);
  },

  viewSlideshowItem : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Slideshow viewed',
        'Slideshow Item' ]);
  },

  viewVideoItem : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Video viewed', 'Video Item' ]);
  },

  scrollStory : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Scroll Story', 'Story' ]);
  },
  
  changeStory : function() {
    _gaq.push([ '_trackEvent', 'Item modification', 'Changed of story' ]);
  },
  
  moveItem : function() {
  	_gaq.push([ '_trackEvent', 'Item modification', 'Position changed' ]);
  },

  deleteItem : function() {
  	_gaq.push([ '_trackEvent', 'Item modification', 'Item deleted' ]);
  },
  
  changeItemImage : function() {
  	_gaq.push([ '_trackEvent', 'Item modification', 'Image changed', 'Default or Image Item' ]);
  },
    
  changeItemTitle : function() {
  	_gaq.push([ '_trackEvent', 'Item modification', 'Image changed', 'Default or Image Item' ]);
  },
    
  updateVersion : function(currVersion) {
    _gaq.push([ '_trackEvent', 'Extension update', currVersion ]);
  },
});

Cotton.ANALYTICS = new Cotton.Analytics();

_.extend(Cotton.ANALYTICS, Backbone.Events);
// })();
