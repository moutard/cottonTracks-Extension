"use strict";

/**
 * Generic class for a card, will be extended to Card.Default, Card.Image, Card.Video
 * Card.Map, ...
 * contains a card with a media part (left), and details (right) with title and url
 * also the website domain and favicon
 **/
Cotton.UI.Stand.Story.Card.Card = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * Local Dispatcher just for a card
   */
  _oLocalDispatcher : null,

  /**
   * {DOM} card frame
   */
  _$card : null,

  /**
   * {DOM} media container, left part of the card
   */
  _$media : null,

  /**
   * {DOM} details container (title, quotes,...), right part of the card
   */
  _$details : null,

  /**
   * {Cotton.UI.Stand.Story.Card.Content.Title} title object for the card
   */
  _oTitle : null,

  /**
   * {DOM} delete cross
   */
  _$delete : null,

  /**
   * {DOM} full url, on bottom right end corner
   */
  _$url : null,

  /**
   * {Cotton.UI.Stand.Story.Card.Content.Website} website object for the card,
   * with favicon and domain
   */
  _oWebsite : null,

  /**
   * @param{Cotton.Model.oHistoryItem} oHistoryItem:
   *    historyItem of the card, needed for the details
   * @param{Cotton.Messaging.Dispatcher} oGlobalDisPatcher
   */
  init : function(oHistoryItem, oGlobalDispatcher) {
    this._oLocalDispatcher = new Cotton.Messaging.Dispatcher();

    this._$card = $('<div class="ct-card"></div>');
    this._$details = $('<div class="ct-card_details"></div>');
    this._oTitle = new Cotton.UI.Stand.Story.Card.Content.Title(oHistoryItem);
    this._$delete = $('<div class="ct-delete_card"></div>').click(function(){
      oGlobalDispatcher.publish('delete_card', {'history_item': oHistoryItem.id()});
    });
    this._$url = $('<div class="ct-card_url">' + oHistoryItem.url() +'</div>');
    this._oWebsite = new Cotton.UI.Stand.Story.Card.Content.Website(oHistoryItem.url(), this._oLocalDispatcher);
  },

  $ : function() {
    return this._$card;
  },

  setType : function(sType) {
    this._$card.addClass('ct-' + sType + '_card');
  },

  /**
   * we use drawCard and not the init function because we need the media to be set
   * before the rest for css reasons (for $details to know what size to take)
   * TODO(rkorach) see if it is better to have local variable than attributes
   */
  drawCard : function() {
    this._$card.append(
      this._$media,
      this._$details.append(
        this._oTitle.$(),
        this._$url
      ),
      this._$delete,
      this._oWebsite.$()
    );
  },

  purge : function() {
    this._oGlobalDispatcher = null;
    this._oTitle.purge();
    this._oTitle = null;
    this._$url = null;
    this._$details.remove();
    this._$details = null;
    if (this._$media) {
      this._$media.remove();
      this._$media = null;
    }
    this._$delete.unbind('click');
    this._$delete.remove();
    this._$delete = null;
    this._oWebsite.purge();
    this._oWebsite = null;
    this._$card.remove();
    this._$card = null;
   }

});
