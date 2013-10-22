"use strict";

/**
 * Class reponsible for displaying just a fix number of shelves for partial stories.
 * For the moment only one shelf.
 * Ex:
 * - result of a search.
 * -
 */
Cotton.UI.Stand.Partial.UIPartial = Class.extend({

  /**
   * {Cotton.Messaging.Dispatcher}
   * General Dispatcher that allows two diffent parts of the product to
   * communicate together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM}
   * manager element, contains all the shelves.
   */
  _$partial : null,

  /**
   * Array<Cotton.UI.Stand.Manager.Shelf> _lShelves: list of shelves,
   * that contains time stamp and corresponding cover.
   */
  _lShelves : null,

  init : function(lStories, sTitle, sEmptyMessage, oGlobalDispatcher) {
    var self = this;

    this._oGlobalDispatcher = oGlobalDispatcher;
    this._lShelves = [];

    // DOM object for the manager.
    this._$partial = $('<div class="ct-manager"></div>');
    this._$container = $('<div class="ct-shelves_container"></div>');
    this._$no_story = $('<div class="ct-no_story"></div>').text(sEmptyMessage);

    this._$partial.append(this._$container);
    var oShelf = new Cotton.UI.Stand.Manager.Shelf({
      'title': sTitle
    }, this._oGlobalDispatcher);
    oShelf.addStories(lStories);
    this._$container.append(oShelf.$());
    this._lShelves.push(oShelf);
    this.setShelvesHeight(this._computeSlots());
  },

  _computeSlots : function() {
    // we store the manager width in case an operation is done while manager is detached.
    this._iContainerWidth = this._$container.width() || this._iContainerWidth;
    var COVER_WIDTH = 396;
    var COVER_MARGIN = 25;
    // The container can always have 2 or 3 covers per line
    var iSlotsPerLine = (this._iContainerWidth <= (COVER_WIDTH * 3) + (COVER_MARGIN * 2)) ? 2 : 3;
    return iSlotsPerLine;
  },

  setShelvesHeight : function(iSlotsPerLine) {
    var iLength = this._lShelves.length;
    for (var i = 0; i < iLength; i++) {
      this._lShelves[i].setHeight(iSlotsPerLine);
    }
  },

  _purgeShelves : function() {
    var iLength = this._lShelves.length;
    for (var i = 0; i < iLength; i++) {
      this._lShelves[i].purge();
      this._lShelves[i] = null;
    }
    this._lShelves = null;
  },

  purge : function() {
    this._oGlobalDispatcher = null;

    this._purgeShelves();

    this._$no_story.remove();
    this._$no_story = null;

    this._$container.empty().remove();
    this._$container = null;

    this._$partial.remove();
    this._$partial = null;

  },

  $ : function() {
    return this._$partial;
  }

});
