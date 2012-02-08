'use strict';

// A curved vertical line representing a story.
// oCenter should be a UI.Point instance.
UI.Path.Line = function(oFrameCenter) {
  var iWidth = 1000;
  var iHeight = 1000;
  var iCenterX = iWidth / 2;
  var iCenterY = iHeight / 2;
  var oPaper = this._oPaper = new Raphael(oFrameCenter.fX - iCenterX, oFrameCenter.fY - iCenterY, iWidth, iHeight);

  var oGraphPath = this._oGraphPath = oPaper.path('M ' + iCenterX + ' ' + iCenterY);
  oGraphPath.attr(
    {
      'stroke': '#333333',
      'stroke-width': 4,
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round'
    }
  );

  // For testing.
  // We need to use the same number of points in the initial and final paths so that each point gets animated
  // to its final position correctly.
  var iNumberOfPoints = 10;
  var iHorizontalShift = 30;
  var lInitialPoints = [];
  var lFinalPoints = [];
  for (var iI = 0; iI < iNumberOfPoints; iI++) {
    var oInitialPoint = new UI.Point(iCenterX, iCenterY);
    var oFinalPoint;
    var iFinalY = (iI / iNumberOfPoints) * iHeight;
    if (iI % 2) {
      oFinalPoint = oInitialPoint.translate(iHorizontalShift, iFinalY - oInitialPoint.fY);
    } else {
      oFinalPoint = oInitialPoint.translate(-iHorizontalShift, iFinalY - oInitialPoint.fY);
    }
    lInitialPoints.push(oInitialPoint);
    lFinalPoints.push(oFinalPoint);
  }
  
  this.animate(this.pathFromPoints(lFinalPoints), 500);
};

$.extend(UI.Path.Line.prototype, {
  
  // Returns a jQuery object containing the node.
  $: function() {
    return $(this._oGraphPath.node.parentNode);
  },

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
