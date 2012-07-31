'use strict'
/**
 *  Commands bar in the StickyBar.
 *
 *  Contains all the button.
 *  - homepage
 *  - edit
 *  - flip
 *  - search
 */
Cotton.UI.StickyBar.Commands = Class.extend({

  _oBar : null,

  _$commands : null,

  _$HomepageButton : null,
  _$EditButton : null,

  _$Flip : null,

  _$ShareButton : null,
  _$SearchButton : null,

  /**
   * @constructor
   */
  init : function(oBar) {
    var self = this;
    this._oBar = oBar;
    this._$commands = $('.ct-commands');
    this._$HomepageButton = $('.ct-iconButton_home');

    this._$HomepageButton.click(function() {
      Cotton.UI.Homepage.HOMEPAGE.show();
      self._oBar.open();
    });

    $('.ct-flip').click(function() {
      self._oBar.openClose();
    });

    this._$EditButton = $('.ct-textButton_edit');
    this._$EditButton.addClass('edit_mode_off');
    this._$EditButton.click(function() {
      if ($(this).hasClass('edit_mode_off')) {
        self._oBar._bEditMode = true;
        $(this).removeClass('edit_mode_off');
        $(this).addClass('edit_mode_on');
        _.each(self._oBar._lStickers, function(oSticker) {
          // oSticker.$().addClass('editable');
          oSticker.editable();
        });
        // Event tracking
        if (Cotton.Config.Parameters.bAnalytics === true) {
          _gaq.push([ '_trackEvent', 'Story modification', 'Edit on' ]);
        }
      } else {
        self._oBar._bEditMode = false;
        $(this).removeClass('edit_mode_on');
        $(this).addClass('edit_mode_off');
        _.each(self._oBar._lStickers, function(oSticker) {
          // oSticker.$().removeClass('editable');
          oSticker.editable();
        });
        // Event tracking
        if (Cotton.Config.Parameters.bAnalytics === true) {
          _gaq.push([ '_trackEvent', 'Story modification', 'Edit off' ]);
        }
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
