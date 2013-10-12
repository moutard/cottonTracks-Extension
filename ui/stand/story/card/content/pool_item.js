"use strict";

/**
 * class representing an entry from the pool items to be possibly added to a story
 */

Cotton.UI.Stand.Story.Card.Content.PoolItem = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} dom object for this entry, containing a favicon, title, url
   */
  _$pool_item : null,

  /**
   * {DOM} favicon
   */
  _$favicon : null,

  /**
   * {DOM} title
   */
  _$title : null,

  /**
   * {DOM} url
   */
  _$url : null,

  init : function(oHistoryItem, iStoryId, oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._iId = oHistoryItem.id();

    this._$pool_item = $('<div class="ct-pool_item"></div>').click(function(){
      // analytics tracking.
      Cotton.ANALYTICS.addCard();

      oHistoryItem.setStoryId(iStoryId);
      self._oGlobalDispatcher.publish('add_item_to_story', {
        'history_item': oHistoryItem,
        'story_id': iStoryId
      });
    });
    this._$favicon = $('<img class="ct-pool_item_favicon" src="' + self.faviconUrl(oHistoryItem.url()) +'">');
    this._$title = $('<div class="ct-pool_item_title">' + oHistoryItem.title() + '</div>');
    this._$url = $('<div class="ct-pool_item_url">' + oHistoryItem.url() + '</div>');

    this._$pool_item.append(
      this._$favicon,
      this._$title,
      this._$url
    );

    this._oGlobalDispatcher.subscribe('append_new_item', this, function(dArguments){
      if (dArguments['history_item'].id() === oHistoryItem.id()) {
        this.purge();
      };
    });
  },

  $ : function() {
    return this._$pool_item;
  },

  id : function() {
    return this._iId;
  },

  /**
   * this calls the core API to get the favicon
   * @param {string} sUrl:
   *    url of the historyItem
   *
   * >returns {string}
   *    chrome://favicon/sUrl or opera://favicon/sUrl
   */
  faviconUrl : function(sUrl) {
    var oFavicon = new Cotton.Core.Favicon();
    return oFavicon.getSrc() + sUrl;
  },

  purge : function() {
    this._$favicon = null;
    this._$title = null;
    this._$url = null;

    this._oGlobalDispatcher.unsubscribe('append_new_item', this);

    this._$pool_item.unbind('click').empty().remove();
    this._$pool_item = null;
  }
});