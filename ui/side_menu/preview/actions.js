'use strict';

/**
 *   Actions for the story (share, comment, star)
 **/

Cotton.UI.SideMenu.Preview.Actions = Class.extend({

  /**
   * {Cotton.UI.SideMenu.Preview} parent element.
   */
  _oPreview : null,

  /**
   * {DOM} current element.
   */
  _$actions : null,

  _$star : null,
  _$comment : null,
  _$share : null,

  init: function(oPreview){

    this._oPreview = oPreview;

    // Current element.
    this._$actions = $('<div class="ct-actions"></div>');

    // Sub elements.
    this._$star = $('<div class="ct-action star"></div>');
    this._$comment = $('<div class="ct-action comment"></div>');
    this._$share = $('<div class="ct-action share"></div>');

    //construct element
    this._$actions.append(
      this._$star,
      this._$comment,
      this._$share
    );

  },

  $ : function(){
    return this._$actions;
  },

  preview : function(){
    return this._oPreview;
  }

});
