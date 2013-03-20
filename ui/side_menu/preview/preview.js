'use strict';

/**
 * Upper block of the menu, contains sticker and actions.
 */

Cotton.UI.SideMenu.Preview.Element = Class.extend({

  /**
   * {Cotton.UI.SideMenu.Menu} parent element.
   */
  _oMenu : null,

  /**
   * {DOM} current element.
   */
  _$preview : null,

  _oSticker : null,
  _oActions : null,

  init: function(sTitle, sImage, oMenu){
    this._oMenu = oMenu;

    this._$preview = $('<div class="ct-sum_up"></div>');
    this._oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(sTitle, sImage, this);
    this._oActions = new Cotton.UI.SideMenu.Preview.Actions(this);

    //construct element
    this._$preview.append(
	    this._oSticker.$()
	  );
  },

  $ : function(){
	  return this._$preview;
  },

  menu : function(){
    return this._oMenu;
  },

  sticker : function(){
    return this._oSticker;
  }

});
