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

  clickDefaultElementTitle : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Element Title Clicked',
        'Default Element' ]);
  },

  clickDefaultElementFeaturedImage : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Element Featured Image Clicked',
        'Default Element' ]);
  },

  clickSearchElementTitle : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Element Title Clicked',
        'Search Element' ]);
  },

  clickSearchElementFeaturedImage : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Element Featured Image Clicked',
        'Search Element' ]);
  },

  viewImageElement : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Image viewed', 'Image Element' ]);
  },

  viewSlideshow : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Slideshow viewed',
        'Slideshow Element' ]);
  },

  viewVideo : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Video viewed', 'Video Element' ]);
  },

  scrollStory : function() {
    _gaq.push([ '_trackEvent', 'Story use', 'Scroll Story', 'Story' ]);
  },
});

Cotton.ANALYTICS = new Cotton.Analytics();

_.extend(Cotton.ANALYTICS, Backbone.Events);
// })();
