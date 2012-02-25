'use strict';

// A curved vertical line representing a story.
// oCenter should be a UI.Point instance.
UI.Path.Line = function(oFrameCenter) {
  // TODO(fwouts): Set the width and height in a more elegant manner.
  var iWidth = this._iWidth = 100;
  var iHeight = this._iHeight = 1000;
  var iCenterX = iWidth / 2;
  var iCenterY = iHeight / 2;
  var iOriginX = oFrameCenter.fX - iCenterX;
  var iOriginY = oFrameCenter.fY - iCenterY;
  this._oOrigin = new UI.Point(iOriginX, iOriginY);
  this._oCenter = new UI.Point(iCenterX, iCenterY);
  this._visible = false;
  this._lBubbles = [];
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
  },
  
  show: function() {
    var self = this;
    
    this._visible = true;
    
    var oPaper = this._oPaper = new Raphael(this._oOrigin.fX, this._oOrigin.fY, this._iWidth, this._iHeight);
    
    var dDefaultStyle = {
      'stroke': '#333',
      'stroke-width': 4,
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round',
      'cursor': 'pointer'
    };
    var dHoverStyle = {
      'stroke': '#000',
      'stroke-width': 6
    };

    // We need to use the same number of points in the initial and final paths so that each point gets animated
    // to its final position correctly.
    var iNumberOfPoints = 10;
    var iHorizontalShift = 30;
    var lInitialPoints = [];
    var lFinalPoints = [];
    for (var iI = 0; iI < iNumberOfPoints; iI++) {
      var iFinalY = (iI / iNumberOfPoints) * this._iHeight;
      var oInitialPoint = this._oCenter;
      var oFinalPoint;
      if (iI % 2) {
        oFinalPoint = oInitialPoint.translate(iHorizontalShift, iFinalY - this._oCenter.fY);
      } else {
        oFinalPoint = oInitialPoint.translate(-iHorizontalShift, iFinalY - this._oCenter.fY);
      }
      lInitialPoints.push(oInitialPoint);
      lFinalPoints.push(oFinalPoint);
    }

    var oGraphPath = this._oGraphPath = oPaper.path(this.pathFromPoints(lInitialPoints));
    oGraphPath.attr(dDefaultStyle);
    oGraphPath.hover(function() {
      // Hover in.
      this.animate(dHoverStyle, 100);
    }, function() {
      // Hover out.
      this.animate(dDefaultStyle, 100);
    });
    
    this.animate(this.pathFromPoints(lFinalPoints), 500, null, function() {
      // When the line has reached its final position, show the lBubbles.
      $.each(lFinalPoints, function(iI, oPoint) {
        var oBubble = new UI.Path.Bubble();
        // Since oPoint is relative to the position of the line, we need to give an absolute position by
        // shifting using oOrigin.
        oBubble.setOrigin(oPoint.translate(self._oOrigin));
        self._lBubbles.push(oBubble);
      });
    });
  },
  
  hide: function() {
    var self = this;
    
    this._visible = false;
    
    this._oPaper.remove();
    $.each(this._lBubbles, function(iI, oBubble) {
      oBubble.remove();
    });
    
    this._oPaper = null;
    this._oGraphPath = null;
    this._lBubbles = [];
  },
  
  toggle: function() {
    if (this._visible) {
      this.hide();
    } else {
      this.show();
    }
  },
  
  isVisible: function() {
    return this._visible;
  }
  
});
