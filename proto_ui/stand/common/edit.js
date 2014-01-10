"use strict";

Cotton.UI.Stand.Common.Edit = Class.extend({

  init : function(oCheesecake, oLocalDispatcher, oGlobalDispatcher) {
    this._$edit_panel = $('<div class="ct-sticker_edit_panel"></div>');
    this._$edit_title = $('<input class="ct-sticker_edit_title"/>').val(oCheesecake.title())
      .keyup(function(){
        oLocalDispatcher.publish('edit_title', {
          'title': $(this).val()
        });
    });

    this._sInitialTitle = oCheesecake.title();

    this._$edit_title_legend = $('<div class="ct-sticker_edit_title_legend">Edit your title here</div>');
    this._oImagePicker = new Cotton.UI.Stand.Common.ImagePicker(oCheesecake, oLocalDispatcher, oGlobalDispatcher);

    this._$delete = $('<div class="ct-sticker_edit_delete">Delete Deck</div>').click(function(){
      oGlobalDispatcher.publish('delete_cheesecake', {
        'id': oCheesecake.id()
      });
    });

    this._$edit_panel.append(
      this._$edit_title,
      this._$edit_title_legend,
      this._oImagePicker.$(),
      this._$delete
    );
  },

  $ : function() {
    return this._$edit_panel;
  },

  getTitle : function() {
    return this._$edit_title.val();
  },

  unselectAllImages : function() {
    this._oImagePicker.unselectAll();
  },

  purge : function() {
    if (this._$edit_title.val() !== this._sInitialTitle) {
      Cotton.ANALYTICS.editDeckSticker('title');
    }
    this._oImagePicker.purge();
    this._oImagePicker = null;
    this._sInitialTitle = null;
    this._$edit_title.remove();
    this._$edit_title = null;
    this._$edit_title_legend.remove();
    this._$edit_title_legend = null;
    this._$delete.remove();
    this._$delete = null;
    this._$edit_panel.remove();
    this._$edit_panel = null;
  }

});