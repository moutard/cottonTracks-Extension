(function() {
  
  $(document).mouseup(function(oEvent) {
    var oSelection = window.getSelection();
    
    if (oSelection.isCollapsed) {
      // Do not do anything on empty selections.
      return;
    }
    
    var oStartNode = oSelection.anchorNode;
    var oEndNode = oSelection.focusNode;
    
    console.log(oSelection.toString());
  });
})();
