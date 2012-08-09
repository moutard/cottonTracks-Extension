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
    _gaq.push(['_setAccount', 'UA-30134257-1']);
    _gaq.push(['_trackPageview']);

    self._oGoogleAnalytics = document.createElement('script');
    self._oGoogleAnalytics.type = 'text/javascript';
    self._oGoogleAnalytics.async = true;
    self._oGoogleAnalytics.src = 'https://ssl.google-analytics.com/ga.js';

    var oScript = document.getElementsByTagName('script')[0];
    oScript.parentNode.insertBefore(self._oGoogleAnalytics, oScript);
  },

});
Cotton.oAnalytics = new Cotton.Analytics();

_.extend(Cotton.oAnalytics, Backbone.Events);
})();
