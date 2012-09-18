'use strict';

/**
 * Item toolbox In the UI V2, item toolbox correponds to the block that contains
 * the date and the favicon. This toolbox is always present in all the
 * story_items.
 */
Cotton.UI.Story.Item.Toolbox = Class.extend({

  _oContentItem : null,

  _$item_toolbox : null,

  _$date : null,
  _$faviconButton : null,
  _$favicon : null,
  _$url : null,
  _$edit_button : null,
  _$lock_button : null,
  _oItemEditbox : null,

  init : function(oContentItem) {
    var self = this;
    // current parent element.
    this._oContentItem = oContentItem;

    // current item.
    this._$item_toolbox = $('<div class="ct-item_toolbox"></div>');

    // current sub elements.
    this._$date = $('<div class="ct-date"></div>');
    this._$faviconButton = $('<div class="ct-favicon"></div>');
    this._$favicon = $('<img>');
    this._$url = $('<div class="ct-item_url"></div>');
    this._$edit_button = $('<div class="ct-edit_button"></div>');
    this._$lock_button = $('<div class="ct-lock_button"></div>');
    this._oItemEditbox = new Cotton.UI.Story.Item.Editbox();

    // set the value

    // date
    var oDate = new Date(this._oContentItem._oItem._oVisitItem.visitTime());
    var lDate = oDate.toDateString().split(" ");
    this._$date.text(lDate[2] + " " + lDate[1]);

    // favicon
    this._$favicon.attr("src", "/media/images/story/item/default_favicon.png");
    this._$faviconButton.append(this._$favicon);

    // button
    this._$edit_button
        .append('<img src="/media/images/story/item/settings_favicon.png">');
    this._$edit_button.click(function(){
      self._oItemEditbox.openClose();
    });

    this._$lock_button
        .append('<img src="/media/images/story/item/history_favicon.png">');

    // url
    var sUrl = this._oContentItem._oItem._oVisitItem.url();
    // Extracts www.google.fr from http://www.google.fr/abc/def?q=deiubfds.
    var oReg = new RegExp("\/\/([^/]*)\/");
    var sDomain = sUrl.match(oReg)[1];
    this._$url.text(sDomain);

    // create the item
    this._$item_toolbox.append(this._$date, this._$faviconButton,
        this._$edit_button, this._$lock_button, this._oItemEditbox.$());
  },

  $ : function() {
    return this._$item_toolbox;
  },

  contentItem : function(){
    return this._oContentItem;
  },

  appendTo : function(oItem) {
    oItem.$().append(this._$item_toolbox);
  },

});
