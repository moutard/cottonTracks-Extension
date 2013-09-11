"use strict";

/**
 * Class that display the date follow by an horizontal date in the journal.
 */
Cotton.UI.Stand.Manager.Shelf = Class.extend({

  /**
   * Element that handle date display, and the line. That's the id
   * of the shelf.
   */
  _oTimestamp : null,

  /**
   * Contains all the stickers (cover).
   */
  _oStickerContainer : null,

  /**
   * {DOM} Shelf element.
   */
  _$shelf : null,

  init : function(fTomorrow, fLastTimeStamp, sScale, lStories) {
    this._oTimestamp = new Cotton.UI.Stand.Manager.TimeStamp(fTomorrow, fLastTimeStamp, sScale);
    this._$shelf = $('<div class="ct-shelf"></div>');
    this._$shelf.append(this._oTimestamp.$());
    DEBUG && console.debug("shelf contains: " + lStories.length);
  },

  $ : function() {
    return this._$shelf;
  },

  purge : function() {
    this._oTimestamp.purge();
    this._$shelf.remove();
  },

});