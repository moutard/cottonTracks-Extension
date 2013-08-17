(function(){
  'use strict';

  var oCache = {};

  /**
   * Find the closest ancestor that satisfy a given selector.
   *
   * Filter out nodes belonging to unwanted parents (scripts, comments, ads...)
   * and accept nodes that satisfy some text-related constraints (sentence regex
   * match and minimum width)
   *
   * @param {String} sSelector A normal CSS3 selector.
   * @param {Node} oNode The child node.
   * @param {Boolean} bIncludeChildren To include or not children in the comparations.
   * @param {Bolean} bCache Whether to use or not a cache.
   * @return {Object} NodeFilter.FILTER_ACCEPT or NodeFilter.FILTER_SKIP
   */
  Cotton.Utils.ancestor = function (sSelector, oNode, bIncludeChildren, bCache) {
    var oMatches;
    var lMatches;
    var oParent = oNode.parentNode;
    if (bCache && oCache.hasOwnProperty(sSelector)) {
      lMatches = oCache[sSelector];
    } else{
      oMatches = document.body.querySelectorAll(sSelector);
      lMatches = oCache[sSelector] = Array.prototype.slice.call(oMatches);
    }
    while(oParent !== document) {
      if (lMatches.indexOf(oParent) > -1) {
        return oParent;
      }
      if (bIncludeChildren) {
        var oChildren = oParent.children;
        var lChildren = Array.prototype.slice.call(oChildren);
        var iLength = lChildren.length;
        for (var i = 0; i < iLength; i++) {
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

  /**
   * Append a node the the cache.
   *
   * @param {String} sSelector A normal CSS3 selector.
   * @param {Node} oNode The node to append.
   */
  Cotton.Utils.appendToCache = function(sSelector, oNode) {
    if (oCache.hasOwnProperty(sSelector)) {
      var oCurrentCache = oCache[sSelector]
      if (oCurrentCache.hasOwnProperty('length')) {
        oCurrentCache.push(oNode);
      }
    }
  };

  /**
   * empty the cache if we want to relaunch parsing.
   */
  Cotton.Utils.emptyCache = function() {
    oCache = {};
  };
})();