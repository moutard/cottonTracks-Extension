(function(){
  'use strict';

  Cotton.Utils.ancestor = function (sSelector, oNode, bIncludeChildren) {
    var oParent = oNode.parentNode;
    var oMatches = document.querySelectorAll(sSelector);
    var lMatches = Array.prototype.slice.call(oMatches);
    while(oParent !== document) {
      if (lMatches.indexOf(oParent) > -1) {
        return oParent;
      }
      if (bIncludeChildren) {
        var oChildren = oParent.children;
        var lChildren = Array.prototype.slice.call(oChildren);
        for (var i = 0, len = lChildren.length; i < len; i++) {
          var oChild = lChildren[i];
          if (lMatches.indexOf(oChild) > -1) {
            return oChild;
          }
        }
      }
      oParent = oParent.parentNode;
    }
    return null;
  };
})();