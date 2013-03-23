'use strict';

/**
 * Map Item. Contains a double container with the map
 * a large label and a large action menu
 */
Cotton.UI.Story.Item.Map = Cotton.UI.Story.Item.Element.extend({

  _oUrl : null,

  // sub elements.
  _$map : null,
  _$itemDoubleContainer : null,
  _oItemLabel : null,


  init : function(oHistoryItem, oDispacher, oItem) {
    this._super(oDispacher, oItem);

    this._sType = "map";

    // current element
    this._$content.addClass('map');

    // current sub elements.
    this._$map = $('<iframe width="400" height="380" src="" frameborder="0"></iframe>');
    this._$itemDoubleContainer = $('<div class="ct-double_container"></div>');
    this._oItemLabel = new Cotton.UI.Story.Item.Content.Brick.LargeLabel(
      oHistoryItem.title(), oHistoryItem.url());

    var sEmbedUrl = oHistoryItem.url() + "&output=embed&iwloc=near";
    this._$map.attr('src', sEmbedUrl);

    // create the item
    this._$item.append(
      this._$content.append(
        this._$itemDoubleContainer.append(this._$map),
        this._oItemLabel.$()
      )
    );
  },

});
