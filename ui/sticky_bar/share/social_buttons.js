'use strict';

/**
 * Share functionality.
 *
 */
Cotton.UI.StickyBar.Share.SocialButtons = Class.extend({

  _$social_buttons : null,
  _$title : null,
  _bIsOpen : null,
  _oKipptButton : null,
  _oTwitterButton : null,

  init: function(){
    var self = this;
    this._$social_buttons = $('<div class="ct-social_buttons"></div>').hide();
    this._$title = $('<h1>Share this story.</h1>');
    this._oKipptButton = new Cotton.UI.StickyBar.Share.KipptButton();
    this._oTwitterButton = new Cotton.UI.StickyBar.Share.TwitterButton();
    var $paragraph = $('<p>Only element marked as public will be shared. Private elements, marked by a lock, will stay yours.</p>');
    this._$social_buttons.append(this._$title, $paragraph, this._oKipptButton.$(), this._oTwitterButton.$());

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
      if(!_oCurrentlyOpenStoryline){
        self._oKipptButton.$().click(false);
        self._oTwitterButton.$().click(false);
      } else {
        self._oKipptButton.$().click(true);
        self._oTwitterButton.$().click(true);
      }
      this._$social_buttons.show();
    }
  },

  deactivateButton : function() {

  }

});
