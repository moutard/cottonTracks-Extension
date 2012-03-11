(function() {
  
  // Disable normal selection highlighting.
  $('<style type="text/css">').html('::selection { background: rgba(0, 0, 0, 0) !important; }').appendTo('body');
  
  var lCurrentHighlightDivs = null;
  var bMouseDown = false;
  
  $(document).mouseup(function(event) {
    lCurrentHighlightDivs = null;
    bMouseDown = false;
  });
  
  $(document).mousedown(function(event) {
    lCurrentHighlightDivs = null;
    bMouseDown = true;
  });
  
  $(document).mousemove(function(oEvent) {
    var oSelection = window.getSelection();
    
    if (oSelection.isCollapsed) {
      // Do not do anything on empty selections.
      return;
    }
    
    if (!bMouseDown) {
      // Only update the selection when the mouse is down.
      return;
    }
    
    var oStartNode = oSelection.anchorNode;
    var oEndNode = oSelection.focusNode;
    
    // Find the closest common parent node.
    var lStartParentNodes = parentNodes(oStartNode);
    var lEndParentNodes = parentNodes(oEndNode);
    var lCommonParentNodes = _.intersection(lStartParentNodes, lEndParentNodes);
    var oClosestCommonParentNode = _.first(lCommonParentNodes);
    var $closestCommonParentNode = $(oClosestCommonParentNode);
    
    var $span= $('<span>&nbsp;</span>');
    
    // We need to invert the calculation if the selection has been made in reverse and inside
    // the same element.Because we add an element inside the selection, it automatically cancels
    // the selection, which is bad.
    if (oSelection.focusNode == oSelection.anchorNode && oSelection.focusOffset < oSelection.anchorOffset) {
      var dStartOffset = offsetAt(oSelection.anchorNode, oSelection.anchorOffset);
      var dEndOffset = offsetAt(oSelection.focusNode, oSelection.focusOffset);
    } else {  
      var dEndOffset = offsetAt(oSelection.focusNode, oSelection.focusOffset);
      var dStartOffset = offsetAt(oSelection.anchorNode, oSelection.anchorOffset);
    }
    
    function offsetAt(oNode, iOffset) {
      var oRange = document.createRange();
      oRange.setStart(oNode, iOffset);
      oRange.insertNode($span[0]);
      return $span.offset();
    }
    
    var iHeight = $span.height();
    $span.remove();
    
    if (dEndOffset.top < dStartOffset.top || (dEndOffset.top == dStartOffset.top && dEndOffset.left < dStartOffset.left)) {
      // We should exchange them.
      var dTemp = dEndOffset;
      dEndOffset = dStartOffset;
      dStartOffset = dTemp;
    }
    
    // Highlight the selection.
    
    var dMainBlockCoordinates = {
      left: Math.min(dStartOffset.left, dEndOffset.left),
      top: dStartOffset.top,
      width: Math.abs(dEndOffset.left - dStartOffset.left),
      height: dEndOffset.top - dStartOffset.top + iHeight
    };
    
    var dCommonCss = {
      background: 'rgba(0, 0, 0, 0.15)',
      position: 'absolute',
      zIndex: 100000000,
      // Be able to click through the overlays.
      pointerEvents: 'none'
    };
    
    var bXStopsBeforeStart = dStartOffset.left > dEndOffset.left;
    
    
    if (!lCurrentHighlightDivs) {
      lCurrentHighlightDivs = [];
      for (var iI = 0; iI < 3; iI++) {
        lCurrentHighlightDivs.push($('<div>').css(dCommonCss).appendTo('body'));
      }
    }
    
    // Middle part of the selection.
    lCurrentHighlightDivs[0].css(_.defaults({
//      background: '#0f0',
      left: dMainBlockCoordinates.left,
      top: dMainBlockCoordinates.top + (bXStopsBeforeStart ? iHeight : 0),
      width: dMainBlockCoordinates.width,
      height: dMainBlockCoordinates.height - (bXStopsBeforeStart ? 2 * iHeight : 0)
    }, dCommonCss));

    // Right part of the selection.
    lCurrentHighlightDivs[1].css(_.defaults({
//      background: '#f00',
      left: dMainBlockCoordinates.left + dMainBlockCoordinates.width,
      top: dMainBlockCoordinates.top,
      width: $closestCommonParentNode.width() - dMainBlockCoordinates.width - dMainBlockCoordinates.left + $closestCommonParentNode.offset().left,
      height: dMainBlockCoordinates.height - iHeight
    }, dCommonCss));

    // Left part of the selection.
    lCurrentHighlightDivs[2].css(_.defaults({
//      background: '#00f',
      left: $closestCommonParentNode.offset().left,
      top: dMainBlockCoordinates.top + iHeight,
      width: dMainBlockCoordinates.left - $closestCommonParentNode.offset().left,
      height: dMainBlockCoordinates.height - iHeight
    }, dCommonCss));
    
    console.log("Main block coordinates:");
    console.log(dMainBlockCoordinates);
    console.log("Start offset:");
    console.log(dStartOffset);
    console.log("End offset:");
    console.log(dEndOffset);
    console.log(oSelection.toString());
  });
  
  function parentNodes(oNode) {
    var lParentNodes = [];
    var oParentNode = oNode;
    do {
      oParentNode = oParentNode.parentNode;
      lParentNodes.push(oParentNode);
    } while (oParentNode.parentNode);
    return lParentNodes;
  };
})();
