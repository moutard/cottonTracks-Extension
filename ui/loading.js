'use strict';

$(window).load(
    function() {
      $('body').addClass('ct-body-loaded');
      $('.ct-landscape').addClass('running');
      // If it's not the first time curtain is already open.
      if (localStorage['CottonFirstOpening'] === undefined
          || localStorage['CottonFirstOpening'] === "true") {
      } else {
        //Cotton.UI.openCurtain();
      }
    });

Cotton.UI.openCurtain = function() {
  $('body').addClass('ct-body-open');
  $('.ct-landscape').removeClass('running');
  $('.ct-landscape').css('opacity', '0');
  $('.ct-window').css('display', 'none');
};

Cotton.UI.closeCurtain = function() {
  $('body').removeClass('ct-body-open');
}
