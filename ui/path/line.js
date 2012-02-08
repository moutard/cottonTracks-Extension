'use strict';

// A curved vertical line representing a story.
UI.Path.Line = function() {
  // TODO: Do not add directly to the body?
  var $container = this._$container = $('body');
  var iWidth = 300;
  var iHeight = 300;
  var oPaper = this._oPaper = new Raphael($container[0], iWidth, iHeight);

  var oGraphPath = this._oGraphPath = oPaper.path('');
  oGraphPath.attr(
    {
      'stroke': '#333333',
      'stroke-width': 4,
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round'
    }
  );

  // For testing.
  this.animate(this.pathFromPoints([new UI.Point(50, 50), new UI.Point(150, 150), new UI.Point(50, 100)]), 4000, null, function() {
    this.animate(this.pathFromPoints([new UI.Point(150, 150), new UI.Point(350, 350), new UI.Point(1000, 1000)]), 4000);
  });
};

$.extend(UI.Path.Line.prototype, {

  // Creates a Raphael path going through all the given points.
  pathFromPoints: function(lPoints) {
    var sPath = 'M ' + lPoints[0].toPath();
    for (var iI = 1, iN = lPoints.length; iI < iN; iI++) {
      // Compute where the control point will be.
      var oPreviousPoint = lPoints[iI - 1];
      var oNextPoint = lPoints[iI];
      var fDiffX = -(oNextPoint.fX - oPreviousPoint.fX) / 2;
      var fDiffY = -(oNextPoint.fY - oPreviousPoint.fY) / 2;
      sPath += ' S ' + oNextPoint.translate(fDiffX, fDiffY).toPath() + ' ' + oNextPoint.toPath();
    }
    return sPath;
  },

  animate: function(sPath, iDuration, sEasing, mOnComplete) {
    var mCallback = null;
    if (mOnComplete) {
      // Execute the callback in the right context.
      var self = this;
      mCallback = function() {
        mOnComplete.call(self);
      };
    }
    sEasing = sEasing || 'ease';
    this._oGraphPath.animate({
      path: sPath,
      callback: mCallback
    }, iDuration, sEasing);
  }
  
});
