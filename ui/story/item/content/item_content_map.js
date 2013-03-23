'use strict';

/**
 * Map Item content. Contains a double container with the map
 * a large label and a large action menu
 */
Cotton.UI.Story.Item.Content.Map = Cotton.UI.Story.Item.Content.Element
    .extend({

      _oUrl : null,

      // sub elements.
      _$map : null,
      _$itemDoubleContainer : null,
      _oItemLabel : null,


      init : function(oHistoryItem, oUrl, oDispacher, oItem) {
        this._super(oHistoryItem, oDispacher, oItem);
        this._sType = "map";
        this._oUrl = oUrl;

        // current element
        this._$content.addClass('ct-item-map map');

        // current sub elements.
        this._$map = $('<iframe width="400" height="380" src="" frameborder="0"></iframe>');
        this._$itemDoubleContainer = $('<div class="ct-double_container"></div>');
        this._oItemLabel = new Cotton.UI.Story.Item.Content.Brick.LargeLabel(
          oHistoryItem.title(), oHistoryItem.url());

        var sEmbedUrl = this._oUrl.href + "&output=embed&iwloc=near";
        this._$map.attr('src', sEmbedUrl);

        // create the item
        this._$content.append(
          this._$itemDoubleContainer.append(this._$map),
          this._oItemLabel.$(),
          this._oToolbox.$()
        );
      },

});
