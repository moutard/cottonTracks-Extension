"use strict";

/**
 * Class for video cards, extends the Card class
 **/
Cotton.UI.Stand.Story.Card.Video = Cotton.UI.Stand.Story.Card.Card.extend({

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
    this._oVideo = new Cotton.UI.Stand.Story.Card.Content.Video(sEmbedCode, sVideoType, this._oLocalDispatcher);
    this._$media = this._oVideo.$();

    this.drawCard();
  },

  purge : function(){
    this._oVideo.purge();
    this._oVideo = null;

    this._super();
  }

});