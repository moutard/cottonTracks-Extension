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
  _$favicon_button : null,
  _$favicon : null,
  _$url : null,
  _$edit_button : null,
  _$lock_button : null,
  _oItemEditbox : null,
  _$removeButton : null,

  init : function(oContentItem) {
    var self = this;
    // current parent element.
    this._oContentItem = oContentItem;

    // current item.
    this._$item_toolbox = $('<div class="ct-item_toolbox"></div>');

    // current sub elements.
    this._$date = $('<div class="ct-date"></div>');
    this._$favicon_button = $('<div class="ct-favicon"></div>');
    this._$favicon = $('<img>');
    this._$url = $('<div class="ct-item_url"></div>');
    this._$edit_button = $('<div class="ct-edit_button"></div>');
    this._$lock_button = $('<div class="ct-lock_button"></div>');
    this._oItemEditbox = new Cotton.UI.Story.Item.Editbox(self);

    // set the value

    // date
    var oDate = new Date(this._oContentItem._oItem._oVisitItem.visitTime());
    var lDate = oDate.toDateString().split(" ");
    this._$date.text(lDate[2] + " " + lDate[1]);

    // favicon
    var sFavicon = this._oContentItem.item().visitItem().favicon();
    if (sFavicon === "") {
      sFavicon = "/media/images/story/item/default_favicon.png";
    }
    this._$favicon.attr("src", sFavicon);
    this._$favicon_button.append(this._$favicon);
    this._$favicon_button.click(function() {

    });

    // button
    this._$edit_button
        .append('<img src="/media/images/story/item/settings_favicon.png">');
    this._$edit_button.mouseup(function() {
      //self._oItemEditbox.openClose();
      self._oContentItem.editable();
    });
    // Qtip library is used to display an help bubble on hover.
    this._$edit_button.qtip({
      content : 'Edit this item',
      position : {
        my : 'top left',
        at : 'bottom right'
      },
      style : {
        tip : true,
        classes : 'ui-tooltip-yellow'
      }
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
    this._$item_toolbox.append(this._$date, this._$favicon_button,
        this._$edit_button, this._$lock_button, this._oItemEditbox.$());
  },

  $ : function() {
    return this._$item_toolbox;
  },

  contentItem : function() {
    return this._oContentItem;
  },

  appendTo : function(oItem) {
    oItem.$().append(this._$item_toolbox);
  },

  addRemoveButton : function(){
    var self = this;
    if(!self._$removeButton){
      self._$removeButton = $('<div class="ct-item_button_remove"></div>');
      self._$removeButton.mouseup(function(){
        // Send message to the controller.
        var iVisitItem = self._oContentItem.item().visitItem()
              .id();
        Cotton.CONTROLLER.removeVisitItemInStory(iVisitItem);

        // Update the view.
        self._oContentItem.item().$().remove();
      });

      self._$item_toolbox.append(self._$removeButton);
    }
  },

  removeRemoveButton : function(){
    var self = this;
    self._$removeButton.remove();
    self._$removeButton = null;
  },
});
