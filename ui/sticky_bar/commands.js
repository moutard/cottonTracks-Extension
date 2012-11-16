'use strict'
/**
 * Commands bar in the StickyBar.
 *
 * Contains all the button. - homepage  search
 */
Cotton.UI.StickyBar.Commands = Class.extend({

  _oBar : null,

  _$commands : null,

  _$homepage_button : null,
  _$search_button : null,
  _$logo_button : null,
  _$recent_button : null,
  _$share_button : null,
  _$settings_button : null,
  _$feedback_button : null,

  _oSocialButtons : null,

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

    this._$settings_button = $('.ct-icon_button_settings');
    this._oSocialButtons = new Cotton.UI.StickyBar.Share.SocialButtons();

    this._$feedback_button = $('.ct-icon_button_feedback');
    
    this._$homepage_button.click(function() {
      Cotton.UI.Home.HOMEPAGE.show();
      self._oBar.open();
    });

    this._$logo_button.click(function() {
      self._oBar.openClose();
    });

    this._$settings_button.click(function(){
      document.location.href="settings/settings.html"
    }).qtip({
      'content' : 'Settings',
      'position' : {
        'my' : 'top center',
        'at' : 'bottom left'
      },
      'show' : 'mouseover',
      'hide' : 'mouseleave',
      'style' : {
        'tip' : true,
        'classes' : 'ui-tooltip-yellow'
      }
    });

    // Unused button
    var dQtipParameters = {
      'content' : 'Non available yet',
      'position' : {
        'my' : 'top left',
        'at' : 'bottom center'
      },
      'show' : 'click',
      'hide' : 'mouseleave',
      'style' : {
        'tip' : true,
        'classes' : 'ui-tooltip-red'
      }
    };

    this._$search_button.click(function(){
      Cotton.UI.Home.HOMEPAGE.hide();
      Cotton.UI.Search.SEARCHPAGE.show();
    });
    this._$recent_button.qtip(dQtipParameters);
    this._$share_button.append(self._oSocialButtons.$()).click(function(){
      self.openShareButtons();
    });

  },

  /**
   * @return {HtmlElement}
   */
  $ : function() {
    return this._$commands;
  },

  openShareButtons : function(){
    this._oSocialButtons.open();
  },
});
