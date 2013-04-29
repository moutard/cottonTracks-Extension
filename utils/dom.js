(function(){
  'use strict';

  Cotton.Utils.ancestor = function (sSelector, oNode) {
    var oParent = oNode.parentNode;
    var oMatches = document.querySelectorAll(sSelector);
    var lMatches = Array.prototype.slice.call(oMatches);
    while(oParent !== document) {
      if (lMatches.indexOf(oParent) > -1) {
        return oParent;
      }
      oParent = oParent.parentNode;
    }
    return null;
  };
})();