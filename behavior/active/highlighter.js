(function() {
  
  $(document).mouseup(function(oEvent) {
    var oSelection = window.getSelection();
    var oStartNode = oSelection.anchorNode;
    var oEndNode = oSelection.focusNode;
    
    if (oSelection.isCollapsed) {
      // Do not do anything on empty selections.
      return;
    }
    
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
    
    // Highlight the selection.
    
    var dMainBlockCoordinates = {
      left: Math.min(dStartOffset.left, dEndOffset.left),
      top: Math.min(dStartOffset.top, dEndOffset.top),
      width: Math.abs(dEndOffset.left - dStartOffset.left),
      height: Math.abs(dEndOffset.top - dStartOffset.top) + iHeight
    };
    
    var dCommonCss = {
      background: 'rgba(0, 0, 0, 0.15)',
      position: 'absolute',
      // Be able to click through the overlays.
      pointerEvents: 'none'
    };
    
    // Middle part of the selection.
    $('<div>').css(_.defaults({
      left: dMainBlockCoordinates.left,
      top: dMainBlockCoordinates.top,
      width: dMainBlockCoordinates.width,
      height: dMainBlockCoordinates.height
    }, dCommonCss), dCommonCss).appendTo('body');

    // Right part of the selection.
    $('<div>').css(_.defaults({
      left: dMainBlockCoordinates.left + dMainBlockCoordinates.width,
      top: dMainBlockCoordinates.top,
      width: $closestCommonParentNode.width() - dMainBlockCoordinates.width - dMainBlockCoordinates.left + $closestCommonParentNode.offset().left,
      height: dMainBlockCoordinates.height - iHeight
    }, dCommonCss)).appendTo('body');

    // Left part of the selection.
    $('<div>').css(_.defaults({
      left: $closestCommonParentNode.offset().left,
      top: dMainBlockCoordinates.top + iHeight,
      width: dMainBlockCoordinates.left - $closestCommonParentNode.offset().left,
      height: dMainBlockCoordinates.height - iHeight
    }, dCommonCss)).appendTo('body');
    
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
