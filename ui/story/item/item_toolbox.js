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
      self._oContentItem.editable();
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
        this._$edit_button, this._$lock_button);
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

  addDeleteButton : function(){
    var self = this;
    if(!self._$delete_button){
      self._$delete_button = $('<div class="ct-item_button_remove"></div>')
      self._$delete_button.append('<img src="/media/images/story/item/delete_favicon.png">');
      self._$delete_button.mouseup(function(e){

        if($(e.target).is('h5')){
          e.preventDefault();
          return;
        }

        if(!self._bDeleteIsOpen){
          self._bDeleteIsOpen = true;
          self.$yes = $('<h5>Yes</h5>').mouseup(function(){
            var iVisitItem = self._oContentItem.item().visitItem().id();
            Cotton.CONTROLLER.removeVisitItemInStory(iVisitItem);

            // Update the view.
            // TODO(rmoutard) : to be MVC complient update the controller should
            // remove the item then call the view to tell her to remove the item.
            self._oContentItem.item().$().hide(
              'slow',
              function(){
                self._oContentItem.item().$().remove();
              });
            // Event tracking
            Cotton.ANALYTICS.deleteItem();
          }).show('slow');
          self.$no = $('<h5>No</h5>').mouseup(function(){
            self._$delete_button.removeClass('open');
            self.$yes.remove();
            self.$no.remove();
            self._bDeleteIsOpen = false;
          }).show('slow');
          self._$delete_button.append(self.$yes, self.$no).addClass('open');
        }

      });

      self._$item_toolbox.append(self._$delete_button);
    }
  },

  removeDeleteButton : function(){
    var self = this;
    self._$delete_button.remove();
    self._$delete_button = null;
  },
});
