'use strict';

/**
 * Image Item content. Contains a double container with the image
 * a small label and a small action menu
 */
Cotton.UI.Story.Item.Content.Image = Cotton.UI.Story.Item.Content.Element.extend({

  _$img : null,

  init : function(oHistoryItem, sType, oDispacher, oItem) {

    this._super(oHistoryItem, oDispacher, oItem);

    this._sTtype = "image";
    this._$content.addClass('ct-item-image image');
    this._$img = $('<img class="resize">');

    if (sType === "img") {
      var sImgSrc = oHistoryItem.url();
      this._$img.attr("src", sImgSrc);
    }
    if (sType === "imgres") {
      var oUrl = new UrlParser(oHistoryItem.url());
      oUrl.fineDecomposition();
      var sImgSrc = this.replaceHexa(oUrl.dSearch['imgurl']);
      this._$img.attr("src", sImgSrc);
    }

    // FIXME(rmoutard): why this line.
    // oItem.historyItem().extractedDNA().setImageUrl(sImgSrc);
    // oItem.world().lightyear().setStoryImage();

    // create the item
		this._$content.append(
		  this._$img,
      this._oToolbox.$()
		);

		this.resize(this._$img);
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
      //center image according on how it overflows
      //if vertical, keep the upper part more visible
      if (fImRatio > fDivRatio) {
        self.css('height',iDivHeight);
        var iOverflow = self.width()-iDivWidth;
        self.css('left',-iOverflow*0.5);
      } else {
        self.css('width',iDivWidth);
        var iOverflow = self.height()-iDivHeight;
        self.css('top',-iOverflow*0.25);
      }
      $(this).show();
    });
  }

});
