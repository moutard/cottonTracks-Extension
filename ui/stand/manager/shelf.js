"use strict";

/**
 * Class that display the date follow by an horizontal date in the journal,
 * and contains the coversContainer (stickers).
 */
Cotton.UI.Stand.Manager.Shelf = Class.extend({

  /**
   * {Cotton.UI.Stand.Manager.Timestamp}
   *  Element that handle date display, and the line. That's the id
   * of the shelf.
   */
  _oTimestamp : null,

  /**
   * {Cotton.UI.Stand.Manager.CoversContainer}
   * Contains all the stickers (cover).
   */
  _oCoversContainer : null,

  /**
   * {DOM} Shelf element.
   */
  _$shelf : null,

  /**
   * @param {float}
   *          fTomorrow: reference date of the day.
   * @param {float}
   *          fLastTimeStamp: visitTime of the last story in the shelf.
   * @param {Array.<Cotton.Model.Stories>}
   *          lStories: list of stories in the current shelf.
   * @param {Cotton.Model.Dispatcher}
   *          oGlobalDispatcher
   */
  init : function(fTomorrow, fLastTimeStamp, lStories, oGlobalDispatcher) {
    DEBUG && console.log("shelf contains: " + lStories.length);

    this._$shelf = $('<div class="ct-shelf"></div>');

    this._oTimestamp = new Cotton.UI.Manager.TimeStamp(fTomorrow,
        fLastTimeStamp);
    this._oCoversContainer = new Cotton.UI.Stand.Manager.CoversContainer(lStories,
        oGlobalDispatcher);

    this._$shelf.append(
      this._oTimestamp.$(),
      this._oCoversContainer.$()
    );
  },

  $ : function() {
    return this._$shelf;
  },

  purge : function() {
    this._oTimestamp.purge();
    this._oCoversContainer.purge();
    this._$shelf.remove();
  },

  numberOfStories : function() {
    return this._oCoversContainer.length();
  },

  addStories : function(lStories) {
    this._oCoversContainer.add(lStories);
  }

});
