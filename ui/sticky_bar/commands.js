'use strict'

Cotton.UI.StickyBar.Commands = Class.extend({

  _oBar : null,

  _$commands : null,

  _$HomepageButton : null,
  _$EditButton : null,

  _$Flip : null,

  _$ShareButton : null,
  _$SearchButton : null,

  init : function(oBar) {
    var self = this;
    this._oBar = oBar;
    this._$commands = $('.ct-commands');
    this._$HomepageButton = $('.ct-iconButton_home');

    $('.ct-flip').click(function() {
      self.openClose();
    });

    this._$EditButton = $('.ct-textButton_edit');
    this._$EditButton.addClass('edit_mode_off');
    this._$EditButton.click(function() {
      if ($(this).hasClass('edit_mode_off')) {
        $(this).removeClass('edit_mode_off');
        $(this).addClass('edit_mode_on');
        console.log('ppp');
        _.each(self._oBar._lStickers, function(oSticker) {
          // oSticker.$().addClass('editable');
          oSticker.editable();
        });
      } else {
        $(this).removeClass('edit_mode_on');
        $(this).addClass('edit_mode_off');
        console.log('ppp');
        _.each(self._oBar._lStickers, function(oSticker) {
          // oSticker.$().removeClass('editable');
          oSticker.editable();
        });
      }

    });
  },

  $ : function() {
    return this._$comands;
  },
});