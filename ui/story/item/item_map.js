'use strict';

/**
 * Map Item. Contains a double container with the map
 * a large label and a large action menu
 */
Cotton.UI.Story.Item.Map = Cotton.UI.Story.Item.Element.extend({

  _oUrl : null,

  // sub elements.
  _$map : null,
  _oItemLabel : null,
  _oToolbox : null,

  init : function(sMapUrl, oHistoryItem, oDispatcher) {
    this._super(oHistoryItem, oDispatcher);

    this.setType("map");

    // current sub elements.
    this._$map = $('<iframe width="360" height="300" src="" frameborder="0"></iframe>');

    this._oItemLabel = new Cotton.UI.Story.Item.Content.Brick.LargeLabel(
      oHistoryItem.title(), oHistoryItem.url());
    this._oToolbox = new Cotton.UI.Story.Item.Toolbox.Simple(
      sMapUrl, oDispatcher, this, 'large');

    var sEmbedUrl = oHistoryItem.url() + "&output=embed&iwloc=near";
    this._$map.attr('src', sEmbedUrl);

    // create the item
    this._$item.append(
      this._$content.append(
        this._$map,
        this._oItemLabel.$(),
        this._oToolbox.$()
      )
    );
  },

});
