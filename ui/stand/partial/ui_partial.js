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

  init : function(sTitle, sEmptyMessage, oGlobalDispatcher) {
    var self = this;

    this._oGlobalDispatcher = oGlobalDispatcher;
    this._lShelves = [];

    // DOM object for the manager.
    this._$partial = $('<div class="ct-manager"></div>');
    this._$container = $('<div class="ct-shelves_container"></div>');
    this._$no_story = $('<div class="ct-no_story"></div>').text(sEmptyMessage);

    this._$partial.append(this._$container);
    this._oShelf = new Cotton.UI.Stand.Manager.Shelf({
      'title': sTitle
    }, this._oGlobalDispatcher);

    this._oGlobalDispatcher.subscribe('remove_cover', this, function(dArguments){
      this.removeCoverFromShelves(dArguments['story_id']);
    });

    this._oGlobalDispatcher.subscribe('unfavorite_story', this, function(dArguments){
      // currently the easiest way to know that we are in the "favorites" partial.
      if (sTitle === "Favorite Stories") {
        this.removeCoverFromShelves(dArguments['story_id']);
      }
    });

    this._oGlobalDispatcher.subscribe('window_resize', this, function(){
      this.setShelvesHeight(this._computeSlots());
    });
  },

  _computeSlots : function() {
    // we store the manager width in case an operation is done while manager is detached.
    this._iContainerWidth = this._$container.width() || this._iContainerWidth;
    var COVER_WIDTH = 396;
    var COVER_MARGIN = 25;
    var EXTERNAL_BORDERS = 2;
    var MAX_COVERS = 3;
    var MIN_COVERS = 2;
    var MAX_INTERCOVERS = MAX_COVERS - 1;
    // The container can always have 2 or 3 covers per line
    var iSlotsPerLine = (this._iContainerWidth < (COVER_WIDTH * MAX_COVERS) + (COVER_MARGIN * MAX_INTERCOVERS) + EXTERNAL_BORDERS) ? MIN_COVERS : MAX_COVERS;
    return iSlotsPerLine;
  },

  appendStories : function(lStories) {
    // we separate this from the init because
    // we need the container to be appended to the DOM
    // to have a width !== 0
    this._oShelf.addStories(lStories, this._computeSlots());
    this._$container.append(this._oShelf.$());
    this._lShelves.push(this._oShelf);
  },

  setShelvesHeight : function(iSlotsPerLine) {
    var iLength = this._lShelves.length;
    for (var i = 0; i < iLength; i++) {
      this._lShelves[i].setHeight(iSlotsPerLine);
    }
  },

  removeCoverFromShelves : function(iStoryId) {
    var iLength = this._lShelves.length;
    // Remaining shelves if one is deleted for emptyness.
    var lRemainingShelves = [];
    for (var i = 0; i < iLength; i++) {
      // Remove the cover if it was in it
      this._lShelves[i].removeCoverFromShelf(iStoryId, this._computeSlots());
      if (this._lShelves[i].numberOfStories() === 0 && this._lShelves[i].isComplete()) {
        // The last cover has been removed and we know this shelf was complete.
        // So we can delete it.
        var shelfToCollapse = this._lShelves[i];
        this.collapseShelf(shelfToCollapse);
      } else {
        lRemainingShelves.push(this._lShelves[i]);
        this._lShelves[i] = null;
      }
    }
    this._lShelves = null;
    this._lShelves = lRemainingShelves;
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
    this._oGlobalDispatcher.unsubscribe('remove_cover', this);
    this._oGlobalDispatcher.unsubscribe('unfavorite_story', this);
    this._oGlobalDispatcher.unsubscribe('window_resize', this);
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
