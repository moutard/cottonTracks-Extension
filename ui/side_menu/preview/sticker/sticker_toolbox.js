'use strict';

Cotton.UI.SideMenu.Preview.Sticker.Toolbox = Class.extend({

  _oDispatcher: null,
  _oSticker: null,

  _$toolbox: null,
  _$rename: null,
  _$delete: null,

  init : function(iStoryId, oSticker, oDispatcher){
    var self = this;
    this._oSticker = oSticker;
    this._oDispatcher = oDispatcher;

    // current item
    this._$toolbox = $('<div class="ct-sticker_toolbox"></div>');

    // current sub elements
    this._$rename = $('<p>Rename</p>');
    this._$delete = $('<p>Delete</p>');

    this._$delete.click(function(){
      self._oDispatcher.publish('story:delete', {
        'id': iStoryId
      });
      Cotton.ANALYTICS.deleteStory();
    });

    this._$rename.click(function(){
      self._oSticker.editTitle();
      Cotton.ANALYTICS.editStoryTitle('sticker_toolbox');
    });

    // construct item
    this._$toolbox.append(
      this._$rename,
      this._$delete
    );

  },

  $ : function() {
    return this._$toolbox;
  },

  renameButton : function() {
    return this._$rename;
  },

  deleteButton : function() {
    return this._$delete;
  }
});