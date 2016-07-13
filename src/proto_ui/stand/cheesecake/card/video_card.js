"use strict";

/**
 * Class for video cards, extends the Card class
 **/
Cotton.UI.Stand.Cheesecake.Card.Video = Cotton.UI.Stand.Cheesecake.Card.Card.extend({

  /**
   * @param{string} sEmbedCode:
   *    embed code of the video, not taken directly from the historyItem because the card factory
   *    extracts it from the url
   * @param{string} sVideoType:
   *    video provider (vimeo, youtube, dailymotion)
   * @param{Cotton.Model.oHistoryItem} oHistoryItem:
   *    historyItem of the card, needed for the details
   * @param{Cotton.Messaging.Dispatcher} oGlobalDispatcher
   **/
  init : function(sEmbedCode, sVideoType, oHistoryItem, oGlobalDispatcher) {
    this._super(oHistoryItem, oGlobalDispatcher);

    this.setType('video');

    // image elements have a full size image as a media
    this._oVideo = new Cotton.UI.Stand.Cheesecake.Card.Content.Video(sEmbedCode, sVideoType, oHistoryItem.extractedDNA().imageUrl());
    this._$media = this._oVideo.$();

    this.setImageInObject();

    this.drawCard();
  },

  setImageInObject : function() {
    var self = this;
    // set the thumbnail as the historyItem image
    if (!this._oHistoryItem.extractedDNA().imageUrl()) {
      this._oVideo.getImage("", function(sImage){
        self._oHistoryItem.extractedDNA().setImageUrl(sImage);
        self._oGlobalDispatcher.publish('update_db_history_item', {
          'history_item': self._oHistoryItem
        });
      });
    }
  },

  purge : function(){
    this._oVideo.purge();
    this._oVideo = null;

    this._super();
  }

});