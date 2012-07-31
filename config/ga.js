// Snippet taken from http://code.google.com/chrome/extensions/trunk/tut_analytics.html.
if (Cotton.Config.Parameters.bAnalytics === true) {
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-30134257-1']);
  _gaq.push(['_trackPageview']);
  (function() {
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  })();
}