'use strict';

Cotton.UI.oCurtain = {};
Cotton.UI.oErrorHandler = new Cotton.UI.ErrorHandler(window);
var iTimeoutIndex;

$(window)
    .load(
        function() {

          // Start the timer.
          // Throw a timeout if the installation exeed one minute.
          iTimeoutIndex = setTimeout(
              function() {
                throw new Error(
                    "Timeout - The installation is too long. Maybe try to close this tab and open a new one.")
              }, 50000);

          Cotton.UI.oCurtain = new Cotton.UI.Curtain(window);
          Cotton.UI.oErrorHandler.setCurtain(Cotton.UI.oCurtain);
          $('body').addClass('ct-body-loaded');
          $('.ct-landscape').addClass('running');
          // If it's not the first time curtain is already open.
          if (localStorage['CottonFirstOpening'] === undefined
              || localStorage['CottonFirstOpening'] === "true") {
          } else {
            Cotton.UI.openCurtain();
          }

          $(".meter > span").each(function() {
            $(this).data("origWidth", $(this).width()).width(0).animate({
              width : $(this).data("origWidth")
            }, 1200);
          });

        });

Cotton.UI.openCurtain = function() {
  clearTimeout(iTimeoutIndex);
  $('body').addClass('ct-body-open');
  $('.ct-landscape').removeClass('running');
  $('.ct-landscape').css('opacity', '0');
  $('.ct-window').css('display', 'none');
};

Cotton.UI.closeCurtain = function() {
  $('body').removeClass('ct-body-open');
}
