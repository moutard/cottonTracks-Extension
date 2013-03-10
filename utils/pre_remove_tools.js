'use strict';
/**
 * PreRemoveTools
 *
 * @param: list of serialized historyItems. (see chrome api for more informations)
 *         remove historyItems that are https, or that are tools.
 */
Cotton.Utils.preRemoveTools = function(lHistoryItems) {
  DEBUG && console.debug('New PreRemoveTools - Start');

  var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

  return _.reject(lHistoryItems, function(dHistoryItem) {
    return (oExcludeContainer.isExcluded(dHistoryItem.url));
  });
};

