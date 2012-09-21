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
  _$search_button : null,
  _$logo_button : null,
  _$recent_button : null,
  _$share_button : null,

  _$edit_button : null,

  /**
   * @constructor
   */
  init : function(oBar) {
    var self = this;
    this._oBar = oBar;
    this._$commands = $('.ct-commands');

    // Sub elements
    this._$homepage_button = $('.ct-icon_button_home');
    this._$search_button = $('.ct-icon_button_search');

    this._$logo_button = $('.ct-icon_button_logo');

    this._$recent_button = $('.ct-icon_button_recent');
    this._$share_button = $('.ct-icon_button_share');

    this._$homepage_button.click(function() {
      Cotton.UI.Home.HOMEPAGE.show();
      self._oBar.open();
    });

    this._$logo_button.click(function() {
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

    // Unused button
    var dQtipParameters = {
      content : 'Non available yet',
      position : {
        my : 'top left',
        at : 'bottom right'
      },
      show : 'click',
      hide : 'mouseleave',
      style : {
        tip : true,
        classes : 'ui-tooltip-red'
      }
    };

    this._$search_button.qtip(dQtipParameters);
    this._$recent_button.qtip(dQtipParameters);
    this._$share_button.qtip(dQtipParameters);
  },

  /**
   * @return {HtmlElement}
   */
  $ : function() {
    return this._$commands;
  },
});
