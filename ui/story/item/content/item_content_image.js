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
    var sImgUrl = sImageUrl
    sImgUrl = sImgUrl.replace('%2521','!');  	
    sImgUrl = sImgUrl.replace('%2522','"');
    sImgUrl = sImgUrl.replace('%2523','#');
    sImgUrl = sImgUrl.replace('%2524','$');
    sImgUrl = sImgUrl.replace('%2525','%');
    sImgUrl = sImgUrl.replace('%2526','&');
    sImgUrl = sImgUrl.replace('%2527',"'");	
    sImgUrl = sImgUrl.replace('%253D','=');  
    sImgUrl = sImgUrl.replace('%253F','?');
    return sImgUrl;
  },
});
