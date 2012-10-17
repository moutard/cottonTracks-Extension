'use strict';

/**
 * Twitter functionality.
 *
 */
Cotton.UI.StickyBar.Share.TwitterButton = Class.extend({

  _$twitter_button: null,

  init: function(){
    var self = this;
    this._$twitter_button = $('<div class="ct-twitter_button">Tweet it</div>').click(function(){
    });
  },

  $ : function(){
    return this._$twitter_button;
  },

});