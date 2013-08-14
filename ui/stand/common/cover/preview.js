"use strict";

/**
 * Preview
 *
 * Contains a sample of the historyItem in a story, by using link.
 */
Cotton.UI.Stand.Common.Cover.Preview = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} container for the preview links
   **/
  _$preview : null,

  /**
   * {DOM} link to enter the story if more than 5 historyItems
   **/
  _$more : null,

  init : function(oStory, oGlobalDispatcher) {
    var self = this;
    var MAX_LINKS = 5;
    this._$preview = $('<div class="ct-cover_preview"></div>');

    var lHistoryItems = oStory.historyItems();
    var iLength = Math.min(lHistoryItems.length, MAX_LINKS);
    for (var i = 0; i < iLength; i++) {
      var oHistoryItem = lHistoryItems[i];
      // Clickable link with a favicon and title in it.
      var sUrl = oHistoryItem.url();

      // If the title is empty (ex: for some images), we put the url instead of
      // the title.
      var sTitle = (oHistoryItem.title() !== "") ? oHistoryItem.title() : sUrl;

      // Clickable link with a favicon and title in it.
      var $link = $('<a class="ct-preview_link" href="' + sUrl
        +'" title="' + sTitle + '" target="_blank"></a>');

      // Favicon using core API.
      var $favicon = $('<img class="ct-preview_favicon" src="'
          + self.faviconUrl(sUrl) +'">');

      // If the title is empty (ex: for some images), we put the url for the title.
      var sTitle = (oHistoryItem.title() !== "") ? oHistoryItem.title() : sUrl;
      var $link_title = $('<span></span>').text(sTitle);

      this._$preview.append(
        $link.append(
          $favicon,
          $link_title
        )
      );
    }

    // If there was more than 5 elements, we append a "...and n more" link
    // clicking it opens the story.
    if (lHistoryItems.length > MAX_LINKS) {
      var iMore = lHistoryItems.length - MAX_LINKS;
      this._$more = $('<div class="ct-more_link">... and ' + iMore + ' more</div>').click(function(){
        oGlobalDispatcher.publish('enter_story', {
          'story': oStory
        });
      });
      this._$preview.append(this._$more);
    }

  },

  $ : function() {
    return this._$preview;
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
    // Remove click event listener.
    if (this._$more) {
      this._$more.unbind('click');
      this._$more.remove();
      this._$more = null;
    }

    this._oGlobalDispatcher = null;

    this._$preview.children().empty().remove();
    this._$preview.remove();
    this._$preview = null;
  }

});
