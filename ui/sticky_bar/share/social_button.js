'use strict';

/**
 * Share functionality.
 *
 */
Cotton.UI.StickyBar.Share.SocialButton = Class.extend({

  _$social_button: null,
  _$social_icon: null,
  _$social_title: null,

  init: function(sId, sTitle, sImagePath){
    var self = this;
    this._$social_icon = $('<img src="' + sImagePath + '"></img>');
    this._$social_title = $('<h2>' + sTitle +'</h2>');
    this._$social_button = $('<div class="ct-social_button ct-'+ sId +'"></div>').append(
      this._$social_icon,
      this._$social_title
    );

    if(_oCurrentlyOpenStoryline){
      this._$social_button.addClass('deactivate');
    } else if (_oCurrentlyOpenStoryline.story()[sId]) {
      this._$social_button.addClass('succeed');
    }
  },

  $ : function(){
    return this._$social_button;
  },

});

