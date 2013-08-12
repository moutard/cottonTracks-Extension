"use strict";

/**
 * Class for map cards, extends the Card class
 **/

Cotton.UI.Stand.Story.Card.Map = Cotton.UI.Stand.Story.Card.Card.extend({

  /**
   * @param{string} sMapUrl:
   *    embed url of the map, not taken directly from the historyItem because the card factory
   *    extracts it from the url
   * @param{Cotton.Model.oHistoryItem} oHistoryItem:
   *    historyItem of the card, needed for the details
   * @param{Cotton.Messaging.Dispatcher} oGlobalDispatcher
   **/
  init : function(sMapCode, oHistoryItem, oGlobalDispatcher) {
    var self = this;
    this._super(oHistoryItem, oGlobalDispatcher);

    this.setType('map');

    var sThumb = "http://maps.googleapis.com/maps/api/staticmap?center=" + sMapCode +
            "&sensor=false&size=500x325&maptype=roadmap&markers=color:blue%7C" + sMapCode;
    var oMapThumb = new Cotton.UI.Stand.Story.Card.Content.ImageFull();
    oMapThumb.appendImage(sThumb);
    this._$media = oMapThumb.$();

    this.drawCard();

    //TODO(rkorach) use Google Maps API.
  }
});