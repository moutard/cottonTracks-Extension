"use strict";

Cotton.UI.Stand.Story.Card.Content.Title = Class.extend({

  /**
   * dom element that displays the title, and serves a the link to open the page again
   **/
  _$title : null,

  /**
   * creates a link opening a page in new tab, and dispalying the title of the card
   * @param {Cotton.Model.HistoryItem} oHistoryItem:
   *    historyItem corresponding to the current card
   **/
  init : function(oHistoryItem) {
    var self = this;
    // if no title (ex: some images), we put the url
    var sTitle = (oHistoryItem.title() !== "") ? oHistoryItem.title() : oHistoryItem.url();
    this._$title = $('<a href="' + oHistoryItem.url() + '" target="_blank" class=ct-card_title></a>').text(sTitle);
  },

  $ : function() {
    return this._$title;
  },

  purge : function() {
    this._$title.remove();
    this._$title = null;
  }
});