'use strict';
/**
 * PreRemoveTools
 *
 * @param: list of serialized visitItems. (see chrome api for more informations)
 *         remove visitItems that are https, or that are tools.
 */
Cotton.Utils.preRemoveTools = function(lVisitItems) {
  console.debug('New PreRemoveTools - Start');

  var oToolsContainer = new Cotton.Utils.ToolsContainer();
  var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

  return _.reject(lVisitItems, function(dVisitItem) {
    var oUrl = new parseUrl(dVisitItem.url);
    var sHostname = oUrl.hostname;
    var sProtocol = oUrl.protocol;
    return (oExcludeContainer.isExcluded(dVisitItem.url) || oToolsContainer
        .isTool(sHostname));
  });
};

