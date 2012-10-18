'use strict';

/**
 * Twitter functionality.
 *
 */
Cotton.UI.StickyBar.Share.TwitterButton = Class.extend({

  _$twitter_button: null,
  _$twitter_icon: null,
  _$twitter_title: null,

  init: function(){
    var self = this;
    this._$twitter_icon = $('<img src="/media/images/topbar/share/twitter.png"></img>');
    this._$twitter_title = $('<h2>Tweet it</h2>');
    this._$twitter_button = $('<div class="ct-social_button ct-twitter"></div>').append(
      this._$twitter_icon,
      this._$twitter_title
    );

    this._$twitter_button.click(function(){
    });
  },

  $ : function(){
    return this._$twitter_button;
  },

});
