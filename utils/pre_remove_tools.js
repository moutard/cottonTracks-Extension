'use strict';
/**
 * PreRemoveTools
 *
 * @param: list of serialized visitItems. (see chrome api for more informations)
 *         remove visitItems that are https, or that are tools.
 */
Cotton.Utils.preRemoveTools = function(lVisitItems) {
  console.debug('New PreRemoveTools - Start');

  var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

  return _.reject(lVisitItems, function(dVisitItem) {
    return (oExcludeContainer.isExcluded(dVisitItem.url));
  });
};

