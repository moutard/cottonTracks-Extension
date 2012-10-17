'use strict';

/**
 * Share functionality.
 *
 */
Cotton.UI.StickyBar.Share.SocialButtons = Class.extend({

  _$social_buttons : null,
  _bIsOpen : null,
  _oKipptButton : null,

  init: function(){
    var self = this;
    this._$social_buttons = $('<div class="ct-social_buttons"></div>');
    this._oKipptButton = new Cotton.UI.StickyBar.Share.KipptButton();

    this._$social_buttons.append(this._oKipptButton.$(), this._oTwitterButton.$());

  },

  $ : function(){
    return this._$social_buttons;
  },

  open : function(){
    var self = this;
    if(self._bIsOpen){
      self._bIsOpen = false;
      this._$social_buttons.hide();
    } else {
      self._bIsOpen = true;
      this._$social_buttons.show();
    }
  },

});