'use strict';

Cotton.UI.openCurtain = function() {
  clearTimeout(iTimeoutIndex);
  $('body').addClass('ct-body-open');
};

Cotton.UI.closeCurtain = function() {
  $('body').removeClass('ct-body-open');
}
