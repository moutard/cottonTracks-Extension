'use strict';

/**
 * Map Item content. Contains a double container with the map
 * a large label and a large action menu
 */
Cotton.UI.Story.Item.Content.Map = Cotton.UI.Story.Item.Content.Element
    .extend({

      _$map : null,
      _oUrl : null,
      _oItemLabel : null,
      _oItemMenu : null,

      _$itemDoubleContainer : null,

      init : function(oItem, oUrl) {
        self = this;
        this._super(oItem);
        this._oItemLabel = new Cotton.UI.Story.Item.LargeLabel(this);
        this._oItemMenu = new Cotton.UI.Story.Item.LargeMenu(this);

        // current element
        oItem.$().addClass('ct-item-map');
        this._$itemDoubleContainer = $('<div class="ct-doublecontainer"></div>');

        // TODO(rmoutard) : why use oURl ?
        this._oUrl = oUrl;

        // current sub elements.
        this._$map = $('<iframe width="400" height="380" src="" frameborder="0"></iframe>');
        var sEmbedUrl = this._oUrl.href + "&output=embed&iwloc=near";
        this._$map.attr('src', sEmbedUrl);

        // create the item
        this._$item_content.append(
          self._$itemDoubleContainer.append(self._$map),
          self._oItemLabel.$(),
          self._oItemMenu.$()
        );
      },

});
