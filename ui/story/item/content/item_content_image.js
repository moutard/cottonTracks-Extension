'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Image = Cotton.UI.Story.Item.Content.Element.extend({

  _$featured_image : null,
  _$img : null,

  init : function(oItem, sType) {
    this._super(oItem);

    this._$featured_image = $('<div class="ct-featured_image"></div>');
    this._$img = $('<img ></img>');

    if (sType === "img") {
      this._$img.attr("src", this._oItem._oVisitItem.url());
      this._oItemFeaturedImage.setImageUrl(this._oItem._oVisitItem.url());
    }
    if (sType === "imgres") {
      var sImgSrc = this.replaceHexa(this._oItem._oVisitItem._oUrl.dSearch['imgurl']);
      this._$img.attr("src", sImgSrc);
      this._oItemFeaturedImage.setImageUrl(sImgSrc);
    }
    this._$featured_image.append(this._$img);
    // create the item
    this._$item_content.append(this._oItemFeaturedImage.$(), this._oItemToolbox.$());
  },
  
  replaceHexa : function(sImageUrl) {
    var sImgUrl = sImageUrl;
    var reg = /\%25/;
    if (reg.test(sImgUrl)){
      sImgUrl = sImgUrl.replace(/\%2525/g,'%')
          .replace(/\%2521/g,'!')
          .replace(/\%2522/g,'"')
          .replace(/\%2523/g,'#')
          .replace(/\%2524/g,'$')
          .replace(/\%2526/g,'&')
          .replace(/\%2527/g,"'")
          .replace(/\%253D/g,'=')
          .replace(/\%253F/g,'?');
    }
    return sImgUrl;
  },
});
