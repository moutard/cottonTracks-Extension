'use strict';

$(window).load(function() {
      $('body').addClass('ct-body-loaded');

      // If it's not the first time curtain is already open.
      if (localStorage['CottonFirstOpening'] !== undefined
      && localStorage['CottonFirstOpening'] !== "true") {
        $('body').addClass('ct-body-open');
      }
});

Cotton.UI.openCurtain = function(){
  $('body').addClass('ct-body-open');
};

Cotton.UI.closeCurtain = function(){
  $('body').removeClass('ct-body-open');
}
