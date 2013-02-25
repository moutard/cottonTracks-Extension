'use strict';

/**
 * Item content In the UI V2, item without the link.
 */
Cotton.UI.Story.Item.Content.Image = Cotton.UI.Story.Item.Content.Element.extend({

  _$img : null,
  _sImageType : null,
  _oItemMenu : null,

  init : function(oItem, sType) {
    self = this;
    this._super(oItem);

    this._sImageType = sType;
    oItem.$().addClass('ct-item-image');
    this._$img = $('<img class="resize">');
    this._oItemMenu = new Cotton.UI.Story.Item.LargeMenu(this);

    if (sType === "img") {
      this._$img.attr("src", this._oItem.visitItem().url());
    }
    if (sType === "imgres") {
      var oUrl = new UrlParser(this._oItem.visitItem().url());
      oUrl.fineDecomposition();
      var sImgSrc = this.replaceHexa(oUrl.dSearch['imgurl']);
      this._$img.attr("src", sImgSrc);
    }
    // create the item
		self._$item_content.append(
		  self._$img,
		  self._oItemMenu.$()
		);

		this.resize(self._$img);
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

  resize : function($img) {
    $img.load(function(){
      var self = $(this);

      //image size and ratio
      var iImWidth = self.width();
      var iImHeight = self.height();
      var fImRatio = iImWidth/iImHeight;

      //div size and ratio
      var iDivWidth = self.parent().width();
      var iDivHeight = self.parent().height();
      var fDivRatio = iDivWidth/iDivHeight;

      if (fImRatio > fDivRatio) {
        self.css('height',iDivHeight);
      } else {
        self.css('width',iDivWidth);
        var iOverflow = self.height()-iDivHeight;
        self.css('top',-iOverflow*0.25);
      }
      $(this).show();
    });
  }
});
