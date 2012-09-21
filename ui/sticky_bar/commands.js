'use strict'
/**
 * Commands bar in the StickyBar.
 * 
 * Contains all the button. - homepage - edit - flip - search
 */
Cotton.UI.StickyBar.Commands = Class.extend({

  _oBar : null,

  _$commands : null,

  _$homepage_button : null,
  _$edit_button : null,

  _$share_button : null,
  _$search_button : null,

  /**
   * @constructor
   */
  init : function(oBar) {
    var self = this;
    this._oBar = oBar;
    this._$commands = $('.ct-commands');
    this._$homepage_button = $('.ct-icon_button_home');
    this._$share_button = $('');
    this._$homepage_button.click(function() {
      Cotton.UI.Home.HOMEPAGE.show();
      self._oBar.open();
    });

    $('.ct-iconButton_logo').click(function() {
      self._oBar.openClose();
    });

    this._$edit_button = $('.ct-iconButton_edit');
    this._$edit_button.addClass('edit_mode_off');
    this._$edit_button.click(function() {
      if ($(this).hasClass('edit_mode_off')) {
        self._oBar._bEditMode = true;
        $(this).removeClass('edit_mode_off');
        $(this).addClass('edit_mode_on');
        _.each(self._oBar._lStickers, function(oSticker) {
          // oSticker.$().addClass('editable');
          oSticker.editable();
        });
        // Event tracking
        Cotton.ANALYTICS.editModeOn();
      } else {
        self._oBar._bEditMode = false;
        $(this).removeClass('edit_mode_on');
        $(this).addClass('edit_mode_off');
        _.each(self._oBar._lStickers, function(oSticker) {
          // oSticker.$().removeClass('editable');
          oSticker.editable();
        });
        // Event tracking
        Cotton.ANALYTICS.editModeOff();
      }

    });
  },

  /**
   * @return {HtmlElement}
   */
  $ : function() {
    return this._$commands;
  },
});
