'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Map = Class
    .extend({

      _oItem : null,

      _$item_content : null,

      _$map : null,
      _oUrl : null,
      _oItemToolbox : null,
      _oItemDescription : null,

      init : function(oItem, oUrl) {
        // current parent element.
        this._oItem = oItem;
        // TODO(rmoutard) : why use oURl ?
        this._oUrl = oUrl;

        // current item.
        this._$item_content = $('<div class="ct-item_content"></div>');

        // current sub elements.
        this._$map = $('<iframe width="380" height="380" src="" frameborder="0"></iframe>');
        var sEmbedUrl = this._oUrl.href + "&output=embed";
        this._$map.attr('src', sEmbedUrl);

        this._oItemToolbox = new Cotton.UI.Story.Item.Toolbox(this);
        this._oItemDescription = new Cotton.UI.Story.Item.Description(this);

        // create the item
        this._$item_content.append(this._$map, this._oItemToolbox.$(),
            this._oItemDescription.$());
      },

      $ : function() {
        return this._$item_content;
      },

      item : function(){
        return this._oItem;
      },

      appendTo : function(oItem) {
        oItem.$().append(this._$item_content);
      },

    });
