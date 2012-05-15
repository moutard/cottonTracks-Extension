'use strict';

Cotton.UI.Point = function(fX, fY) {
  this.fX = fX;
  this.fY = fY;
}

$.extend(Cotton.UI.Point.prototype, {

  toPath: function() {
    return this.fX + ' ' + this.fY;
  },

  translate: function() {
    if (arguments.length == 1) {
      // The argument should be an instance of Cotton.UI.Point.
      var oPoint = arguments[0];
      return new Cotton.UI.Point(this.fX + oPoint.fX, this.fY + oPoint.fY);
    } else {
      // The argument should be a couple of float values.
      var fTx = arguments[0];
      var fTy = arguments[1];
      return new Cotton.UI.Point(this.fX + fTx, this.fY + fTy);
    }
  }

});
