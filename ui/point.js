'use strict';

UI.Point = function(fX, fY) {
  this.fX = fX;
  this.fY = fY;
}

$.extend(UI.Point.prototype, {

  toPath: function() {
    return this.fX + ' ' + this.fY;
  },

  translate: function(fTx, fTy) {
    return new UI.Point(this.fX + fTx, this.fY + fTy);
  }

});
