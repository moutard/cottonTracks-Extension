'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Map = Cotton.UI.Story.Item.Content.Element
    .extend({

      _$map : null,
      _oUrl : null,

      init : function(oItem, oUrl) {
        this._super(oItem);
        // TODO(rmoutard) : why use oURl ?
        this._oUrl = oUrl;

        // current sub elements.
        this._$map = $('<iframe width="400" height="380" src="" frameborder="0"></iframe>');
        var sEmbedUrl = this._oUrl.href + "&output=embed";
        this._$map.attr('src', sEmbedUrl);

        // create the item
        this._$item_content.append(
          this._$map,
          this._oItemToolbox.$(),
          this._oItemDescription.$()
        );
      },
});
