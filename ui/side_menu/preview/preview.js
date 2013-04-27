'use strict';

/**
 * Upper block of the menu, contains sticker and actions.
 */

Cotton.UI.SideMenu.Preview.Element = Class.extend({

  /**
   * {DOM} current element.
   */
  _$preview : null,

  _oSticker : null,
  _oActions : null,

  init: function(oStory, oDispatcher, oMenu){
    this._$preview = $('<div class="ct-sum_up"></div>');
    this._oSticker = new Cotton.UI.SideMenu.Preview.Sticker.Element(oStory,
      oDispatcher, 'currentStory');
    this._oActions = new Cotton.UI.SideMenu.Preview.Actions(this);

    //construct element
    this._$preview.append(
	    this._oSticker.$()
	  );
  },

  $ : function(){
	  return this._$preview;
  },

  sticker : function(){
    return this._oSticker;
  },

  recycle : function(oStory) {
    this._oSticker.recycle(oStory);
  }

});
