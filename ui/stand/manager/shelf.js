"use strict";

/**
 * Class that display the date follow by an horizontal date in the journal,
 * and contains the coversContainer.
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
   * Contains all the covers.
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
  init : function(fTomorrow, fLastTimeStamp, isCompleteMonth,
    oGlobalDispatcher) {

    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oTimestamp = new Cotton.UI.Stand.Manager.TimeStamp(fTomorrow,
        fLastTimeStamp, isCompleteMonth);
    this._oCoversContainer = new Cotton.UI.Stand.Manager.CoversContainer(oGlobalDispatcher);
    this._$shelf = $('<div class="ct-shelf"></div>');

    this._$shelf.append(
      this._oTimestamp.$(),
      this._oCoversContainer.$()
    );

  },

  $ : function() {
    return this._$shelf;
  },

  setHeight : function(iSlotsPerLine) {
    this._oCoversContainer.setHeight(iSlotsPerLine);
    this.postionCovers(iSlotsPerLine);
  },

  postionCovers : function(iSlotsPerLine) {
    this._oCoversContainer.positionCovers(iSlotsPerLine);
  },

  purge : function() {
    this._oTimestamp.purge();
    this._oCoversContainer.purge();
    this._$shelf.remove();
  },

  numberOfStories : function() {
    return this._oCoversContainer.length();
  },

  addStories : function(lStories, iSlotsPerLine) {
    this._oCoversContainer.add(lStories, iSlotsPerLine);
  }

});
