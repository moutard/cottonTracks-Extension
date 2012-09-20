'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Slideshow = Cotton.UI.Story.Item.Content.Element.extend({

  _$slideshow : null,

  init : function(oItem, sEmbedCode) {
    this._super(oItem);

    // current sub elements.
    this._$slideshow = $slideshow = $('<iframe width="380" height="316" marginwidth="0" marginheight="0" scrolling="no" src="" frameborder="0" allowfullscreen></iframe>');
    var sEmbedUrl = "http://www.slideshare.net/slideshow/embed_code/"
        + sEmbedCode;
    this._$slideshow.attr('src', sEmbedUrl);

    // create the item
    this._$item_content.append(this._$slideshow, this._oItemToolbox.$());
  },

});
