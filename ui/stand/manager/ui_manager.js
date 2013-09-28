"use strict";

/**
 * Class reponsible for appending the covers in the main Manager, in separate
 * containers defined by a timestamp
 */
Cotton.UI.Stand.Manager.UIManager = Class.extend({

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
  _$manager : null,

  /**
   * Array<Cotton.UI.Stand.Manager.Shelf> _lShelves: list of shelves,
   * that contains time stamp and corresponding cover.
   */
  _lShelves : null,

  /**
   * {Date}
   * date when the manager is open it's the reference.
   */
  _oNow : null,

  /**
   * {int}
   * last width of the container. Stored in case the manager is detached
   * because then the $container has a size == 0
   */
  _iContainerWidth : null,

  /**
   * @param {Array.<Cotton.Model.Story>}
   *            lStories
   * @param {Cotton.Messaging.Dispatcher}
   *            oGlobalDispatcher
   */
  init : function(oGlobalDispatcher) {
    var self = this;

    this._oGlobalDispatcher = oGlobalDispatcher;
    // DOM object for the manager.
    this._$manager = $('<div class="ct-manager"></div>');
    this._$container = $('<div class="ct-shelves_container"></div>');
    this._$no_story = $('<div class="ct-no_story">YOU DON\'T HAVE ANY STORY YET, START BROWSING AND SEE YOUR STORIES BUILD OVER TIME.</div>');
    this._$load_more = $('<div class="ct-footer ct-load_more">Load More</div>').click(function() {
      self._oGlobalDispatcher.publish('need_more_stories', {});
    });

    // Reference date :
    // We take tomorrow midnight as a reference because "today" is defined as
    // "everything before tomorrow". fTomorrow need to be a attribut in a
    // specific case : you load the interface today and keep it open, the you
    // load more stories the next day. fTomorrow need to be constant.
    // TODO (rmoutard): force the reload if fTomorrow change.
    // set today's date as a reference for timestamps
    this._oNow = new Date();

    this._lShelves = [];

    this._oGlobalDispatcher.subscribe('give_more_stories', this, function(dArguments) {
      self.createShelves(dArguments['lStories']);
    });

    this._$manager.append(this._$container);

    this._oGlobalDispatcher.subscribe('window_resize', this, function(){
      this.setShelvesHeight(this._computeSlots());
    });

    this._oGlobalDispatcher.publish('need_more_stories');
  },

  $ : function() {
    return this._$manager;
  },

  purge : function() {
    this._oGlobalDispatcher = null;

    this._$no_story.remove();
    this._$no_story = null;

    this._$manager.remove();
    this._$manager = null;
  },

  /**
   * Each shelf can store a variable amount of stories. So return the
   * total number of stories in the manager. it's simply the sum of all the
   * stories by each shelf.
   */
  _numberOfStories : function() {
    var iNumberOfStories = 0;
    for (var i = 0, iLength = this._lShelves.length; i < iLength; i++) {
      iNumberOfStories += this._lShelves[i].numberOfStories();
    }
    return iNumberOfStories;
  },

  /**
   * Construct the Shelf and add them to the DOM $manager element.
   *
   * This method allow to cut the code of create shelves. (First integrated to
   * avoid performance issues, but clarity is more important here.
   *
   * @param {Float} fTomorrow:
   *        milliscond since epoch.
   *
   * @param {Int} iCurrentPeriodIndex:
   *        index that allow us to know if there is a already a shelf that can
   *         get those stories.
   *
   * @param {Array.<Cotton.Model.Stories>} lStoriesForPeriod:
   *        array of stories you want to add to the shelf.
   *
   * @param {Boolean} bIsCompleteMonth:
   *        true if the shelf is a complete month.
   */
  _constructShelf : function(fTomorrow, iCurrentPeriodIndex,
        lStoriesForPeriod, bIsCompleteMonth) {
    if (iCurrentPeriodIndex !== this._iCurrentPeriodIndex) {
      // Create new shelf
      var oShelf = new Cotton.UI.Stand.Manager.Shelf(fTomorrow,
          lStoriesForPeriod[0].lastVisitTime(),
          bIsCompleteMonth, this._oGlobalDispatcher);
      DEBUG && console.debug("New shelf contains: " + lStoriesForPeriod.length);
      this._lShelves.push(oShelf);
      this._$container.append(oShelf.$());
    }
    // We put the number of slots in parameter of addStories
    // because having _computeSlots in manager lets us compute it once only
    // every time we need it, instead of once in every shelf.
    this._lShelves[this._lShelves.length -1].addStories(lStoriesForPeriod, this._computeSlots());
  },

  /**
   * Group stories by date and for each group create a shelf.
   *
   * If the shelf already exists, and the stories can be append to it,
   * then add those stories directly in the shelf.
   *
   * @param {Array.<Cotton.Model.Stories>}
   *            lStories: list of stories to put in shelves.
   *            ONLY WORKS IF lStories is SORTED by lastVisitTime most recent
   *            first.
   */
  createShelves : function(lStories) {

    var oNow = this._oNow; // Use a local variable for performance issues.
    var fTomorrow = new Date(oNow.getFullYear(), oNow.getMonth(),
        oNow.getDate() + 1, 0, 0, 0, 0).getTime();

    var ONE_DAY = 86400000; // Millisecond in one day.
    var ONE_WEEK = 604800000; // Millisecond in one week.
    var ONE_MONTH = fTomorrow - new Date(oNow.getFullYear(),
        oNow.getMonth() - 1, 1, 0, 0, 0, 0).getTime();
    // PERIODS represents the threshold of all the periods we want to display.
    // There is a gap between threshold and the display title:
    //  - ONE_DAY -> TODAY
    //  - 2*ONE_DAY -> YESTERDAY
    //  - ONE_MONTH -> earlier in month

    // After ONE_MONTH, all periods are display month by month.
    var PERIODS = [ONE_DAY, 2*ONE_DAY, 3*ONE_DAY, 4*ONE_DAY, 5*ONE_DAY,
        6*ONE_DAY, 7*ONE_DAY, 2*ONE_WEEK, 3*ONE_WEEK, ONE_MONTH];

    // Given an index of period return the corresponding threshold. (It doesn't
    // make sens to make this function a method of manager.)
    var getThreshold = function(iIndex) {
      if (iIndex < PERIODS.length) {
        return PERIODS[iIndex];
      } else {
        var iNextMonth = iIndex - (PERIODS.length - 1);
        return fTomorrow - new Date(oNow.getFullYear(),
            oNow.getMonth() - iNextMonth, 0, 24, 0, 0, 0).getTime();
      }
    };

    var isCompleteMonth = function(iIndex) {
      return iIndex >= PERIODS.length;
    };

    // Initialize period index, threshold and group of stories.
    var iCurrentPeriodIndex = this._iCurrentPeriodIndex || 0;
    var iThreshold = getThreshold(iCurrentPeriodIndex);
    var bIsCompleteMonth = isCompleteMonth(iCurrentPeriodIndex);
    var lStoriesForPeriod = [];

    // For each stories find the corresponding period and add it.
    for (var i = 0, iLength = lStories.length; i < iLength; i++) {
      var oStory = lStories[i];

      if (fTomorrow - oStory.lastVisitTime() <= iThreshold) {
        // Stories belongs to the current period.
        lStoriesForPeriod.push(oStory);
      } else {
        if (lStoriesForPeriod.length > 0) {
          this._constructShelf(fTomorrow, iCurrentPeriodIndex,
              lStoriesForPeriod, bIsCompleteMonth);
          lStoriesForPeriod = [];
          lStoriesForPeriod.push(oStory);
        }
        // Find the next period.
        while (fTomorrow - oStory.lastVisitTime() > iThreshold) {
          iCurrentPeriodIndex++;
          iThreshold = getThreshold(iCurrentPeriodIndex);
          bIsCompleteMonth = isCompleteMonth(iCurrentPeriodIndex);
          lStoriesForPeriod = []; // By security but not necessary.
        }
        lStoriesForPeriod.push(oStory);
      }
    }

    if (lStoriesForPeriod.length > 0) {
      this._constructShelf(fTomorrow, iCurrentPeriodIndex,
          lStoriesForPeriod, bIsCompleteMonth);
    }
    // As iCurrentPeriodIndex is the next possible period, but we want to allow
    // the interface to add stories at the last shelf, so we need to
    // decrease by one iCurrentPeriodIndex.
    this._iCurrentPeriodIndex = iCurrentPeriodIndex;

    if (lStories.length > 0) {
        this._$manager.append(this._$load_more);
    } else {
      if (this._lShelves.length > 0) {
        var $end_of_history = $('<div class="ct-footer ct-end_of_history">'
        + '<span class="ct-footer ct-underline">cotton</span>Tracks</div>');
        this._$load_more.remove();
        this._$manager.append($end_of_history);
      } else {
        this._$manager.append(this._$no_story);
      }
    }
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

  hide : function() {
    this._$manager.detach();
    this._bDetached = true;
  },

  isDetached : function() {
    return this._bDetached;
  },

  attached : function() {
    this._bDetached = false;
  }

});
