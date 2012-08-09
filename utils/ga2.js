'use strict';
(function() {

var _gaq = _gaq || [];

Cotton.Analytics = Class.extend({
  _sAccount : null,
  _oGoogleAnalytics : null,
  _gaq : null,

  init : function(){
    var self = this;
    //self._sAccount = Cotton.Config.Parameters._sAccount;

    self._gaq = _gaq || [];


  if (Cotton.Config.Parameters.bAnalytics === true) {
    _gaq.push(['_setAccount', 'UA-30134257-1']);
    _gaq.push(['_trackPageview']);

      self._oGoogleAnalytics = document.createElement('script');
      self._oGoogleAnalytics.type = 'text/javascript';
      self._oGoogleAnalytics.async = true;
      self._oGoogleAnalytics.src = 'https://ssl.google-analytics.com/ga.js';
      var oScript = document.getElementsByTagName('script')[0];
      oScript.parentNode.insertBefore(self._oGoogleAnalytics, oScript);
    }
  },

  enterStory : function(){
    _gaq.push([ '_trackEvent', 'Story trafic',
                'Enter story', 'Click on sticker']);
  },

  modifyStory = function(){
    _gaq.push(['_trackEvent', 'Story modification', 'modify']);
  },

  deleteStory = function(){
    _gaq.push(['_trackEvent', 'Story modification', 'delete']);
  },

  editModeOn = function(){
    _gaq.push([ '_trackEvent', 'Story modification', 'Edit on' ]);
  },

  editModeoff = function(){
    _gaq.push([ '_trackEvent', 'Story modification', 'Edit off' ]);
  },
});

Cotton.ANALYTICS = new Cotton.Analytics();

_.extend(Cotton.ANALYTICS, Backbone.Events);
})();
