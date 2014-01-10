"use strict";

/**
 * Class for image cards, extends the Card class
 **/
Cotton.UI.Stand.Cheesecake.Card.Image = Cotton.UI.Stand.Cheesecake.Card.Card.extend({
  /**
   * @param{string} sImageUrl:
   *    image to append, not taken directly from the historyItem because the card factory
   *    extracts it from the url
   * @param{Cotton.Model.oHistoryItem} oHistoryItem:
   *    historyItem of the card, needed for the details
   * @param{Cotton.Messaging.Dispatcher} oGlobalDispatcher
   */
  init : function(sImageUrl, oHistoryItem, oGlobalDispatcher) {
    // Init with the parent card class.
    this._super(oHistoryItem, oGlobalDispatcher);

    this.setType('image');

    // Image elements have a full size image as a media.
    var oFullImage = new Cotton.UI.Stand.Cheesecake.Card.Content.ImageFull(sImageUrl);
    this._$media = oFullImage.$();

    this._oLocalDispatcher.publish('media_async_image', {'img_url': sImageUrl});

    this.setImageInObject(sImageUrl)

    this.drawCard();
  },

  setImageInObject : function(sImageUrl) {
    // set the thumbnail as the historyItem image
    if (!this._oHistoryItem.extractedDNA().imageUrl()) {
      this._oHistoryItem.extractedDNA().setImageUrl(sImageUrl);
      this._oGlobalDispatcher.publish('update_db_history_item',{
        'history_item': this._oHistoryItem
      });
    }
  }

});