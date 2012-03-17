'use strict';

// Returns the closest common parent for all matched elements.
$.fn.commonParent = function() {
  var lParentsForEach = $(this).map(function() {
    return $(this).parents();
  });
  var lCommonParents = _.intersection.apply(null, lParentsForEach);
  return $(lCommonParents[0]);
};
