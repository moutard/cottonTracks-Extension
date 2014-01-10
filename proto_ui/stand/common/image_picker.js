"use strict";

Cotton.UI.Stand.Common.ImagePicker = Class.extend({


  init : function(oCheesecake, oLocalDispatcher, oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oLocalDispatcher = oLocalDispatcher;
    this._oCheesecake = oCheesecake;
    this._lImages = [];

    this._$image_picker = $('<div class="ct-image_picker"></div>');
    this._$image_picker_legend = $('<div class="ct-image_picker_legend">Pick the right image</div>');
    this._$carousel =  $('<div class="ct-image_picker_carousel"></div>');

    if (oCheesecake.historyItems().length === 0) {
      oGlobalDispatcher.publish('ask_all_cheesecake_images', {
        'cheesecake_id' : this._oCheesecake.id(),
        'history_items_id': this._oCheesecake.historyItemsId()
      });
    } else {
      this.proposeImages(oCheesecake.historyItems());
    }

    this._oGlobalDispatcher.subscribe('give_all_cheesecake_images', this, function(dArguments) {
      if (dArguments['cheesecake_id'] === this._oCheesecake.id()) {
        this.proposeImages(dArguments['history_items']);
      }
    });
  },

  $ : function() {
    return this._$image_picker;
  },

  getImagesFromItems : function(lHistoryItems) {
    var iLength = lHistoryItems.length;
    var lImagesUrl = [];
    for (var i = 0; i < iLength; i++) {
      var sImageUrl = lHistoryItems[i].extractedDNA().imageUrl();
      if (sImageUrl) {
        lImagesUrl.push(sImageUrl);
      }
    }
    return lImagesUrl;
  },

  proposeImages : function(lHistoryItems) {
    var self = this;
    var lImagesUrl = this.getImagesFromItems(lHistoryItems);
    var iLength = lImagesUrl.length;
    this._sCurrentImage = this._oCheesecake.featuredImage();
    if (iLength) {
      this._$image_picker.append(
        this._$image_picker_legend,
        this._$carousel
      );
    }

    var l$images = [];
    for (var i = 0; i < iLength; i++) {
      var oImage = new Cotton.UI.Stand.Common.Content.BImage();
      oImage.appendImage(lImagesUrl[i]);
      this._lImages.push(oImage);
      var $image = oImage.$();
      if (lImagesUrl[i] === this._sCurrentImage) {
        $image.addClass('ct-image_selected');
      }
      oImage.select(this._oLocalDispatcher);
      l$images.push(oImage.$());
    }
    this._$carousel.append(l$images);

    if (iLength > 4) {
      this._$prev = $('<div class="ct-image_picker_arrow ct-image_picker_left_arrow"></div>').click(
        function(){
          var lRolledImages = [];
          var oMovedImage = self._lImages[iLength-1];
          lRolledImages.push(oMovedImage);
          for (var i = 0; i < iLength-1; i++) {
            lRolledImages.push(self._lImages[i]);
          }
          self._lImages = lRolledImages;
          oMovedImage.$().detach().prependTo(self._$carousel);
        }
      );
      this._$next = $('<div class="ct-image_picker_arrow ct-image_picker_right_arrow"></div>').click(
        function(){
          var lRolledImages = [];
          var oMovedImage = self._lImages[0];
          for (var i = 1; i < iLength; i++) {
            lRolledImages.push(self._lImages[i]);
          }
          lRolledImages.push(oMovedImage);
          self._lImages = lRolledImages;
          oMovedImage.$().detach().appendTo(self._$carousel);
        }
      );
      this._$image_picker.append(
        this._$prev,
        this._$next
      );
    }
  },

  unselectAll : function () {
    var iLength = this._lImages.length;
    for (var i = 0; i < iLength; i++) {
      this._lImages[i].$().removeClass('ct-image_selected');
    }
  },

  _purgeImages : function() {
    var iLength = this._lImages.length;
    for (var i = 0; i < iLength; i++) {
      this._lImages[i].purge();
      this._lImages[i] = null;
    }
    this._lImages = null;
  },

  purge : function() {
    if (this._sCurrentImage !== this._oCheesecake.featuredImage()) {
      Cotton.ANALYTICS.editDeckSticker('image');
    }
    this._oGlobalDispatcher.unsubscribe('give_all_cheesecake_images', this);
    this._oGlobalDispatcher = null;
    this._oLocalDispatcher = null;
    this._oCheesecake = null;
    this._$carousel = null;
    if (this._$prev) {
      this._$prev.remove();
      this._$prev = null;
      this._$next.remove();
      this._$next = null;
    }
    this._purgeImages();
    this._$image_picker_legend.remove();
    this._$image_picker_legend = null;
    this._$image_picker.remove();
  }
});