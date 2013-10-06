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
  init : function(dArguments, oGlobalDispatcher) {

    this._oTimestamp = new Cotton.UI.Stand.Manager.TimeStamp(dArguments);
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

  numberOfStories : function() {
    return this._oCoversContainer.length();
  },

  removeCoverFromShelf : function(iStoryId, iSlotsPerLine) {
    this._oCoversContainer.removeCoverFromContainer(iStoryId, iSlotsPerLine)
  },

  addStories : function(lStories, iSlotsPerLine) {
    this._oCoversContainer.add(lStories, iSlotsPerLine);
  },

  setComplete : function() {
    this._bIsComplete = true;
  },

  isComplete : function() {
    return this._bIsComplete;
  },

  hide : function() {
    // hide both the timestamp and the container by reducing their height to 0
    // they are animated, giving a collapsing effect.
    this._oCoversContainer.$().addClass('ct-collapsed');
    this._oTimestamp.$().addClass('ct-collapsed');
  },

  purge : function() {
    this._bIsComplete = null;
    this._oTimestamp.purge();
    this._oTimestamp = null;
    this._oCoversContainer.purge();
    this._oCoversContainer = null;
    this._$shelf.remove();
  }

});
