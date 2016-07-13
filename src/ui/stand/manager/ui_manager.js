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
    // Reference date :
    // We take tomorrow midnight as a reference because "today" is defined as
    // "everything before tomorrow". fTomorrow need to be a attribut in a
    // specific case : you load the interface today and keep it open, the you
    // load more stories the next day. fTomorrow need to be constant.
    // TODO (rmoutard): force the reload if fTomorrow change.
    // set today's date as a reference for timestamps
    this._oNow = new Date();

    this._lShelves = [];

    // DOM object for the manager.
    this._$manager = $('<div class="ct-manager"></div>');
    this._$container = $('<div class="ct-shelves_container"></div>');
    this._$no_story = $('<div class="ct-no_story">YOU DON\'T HAVE ANY STORY YET, START BROWSING AND SEE YOUR STORIES BUILD OVER TIME.</div>');
    this._$load_more = $('<div class="ct-footer ct-load_more">Loading More...</div>');

    this._$manager.append(this._$container);

    this._$load_more.appendTo(this._$manager).hide();

    this._oGlobalDispatcher.subscribe('window_scroll', this, function(dArguments) {
      if (self._bReadyToLoad && !self._bDetached &&
        (dArguments['scroll_top'] > self._$manager.height() - dArguments['height'] - 100)) {
          self._oGlobalDispatcher.publish('need_more_stories', {
            'fLastVisitTime': self.hashUptoDate()['last']['lastVisitTime']
          });
          self._loading();
      }
    });

    this._oGlobalDispatcher.subscribe('give_more_stories', this, function(dArguments) {
      var iTimeout = (self._lShelves.length === 0) ? 0 : 600;
      setTimeout(function(){
        self.createShelves(dArguments['lStories']);
        self._bReadyToLoad = true;
        if (dArguments['bNoMoreStories']) {
          self._endOfManager();
        } else {
          self.fillScreen();
        }
      }, iTimeout);
    });

    this._oGlobalDispatcher.subscribe('remove_cover', this, function(dArguments){
      this.removeCoverFromShelves(dArguments['story_id']);
      if (!this._bEnd) {
        self.fillScreen();
      }
    });

    this._oGlobalDispatcher.subscribe('window_resize', this, function(){
      this.setShelvesHeight(this._computeSlots());
    });

    this._oGlobalDispatcher.publish('need_more_stories', {
      'fLastVisitTime': new Date().getTime()
    });
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
      // New shelf.
      var iLength = this._lShelves.length;
      if (iLength > 0) {
        // If there was a previous shelf, we mark it as complete.
        // We need it not  to delete a shelf that has no more covers, but could have
        // some more by loading more stories.
        var lastShelf = this._lShelves[iLength - 1];
        lastShelf.setComplete();
        if (lastShelf.numberOfStories() === 0) {
          // The last shelf was empty, and now we know it is complete, so we can delete it.
          this.collapseShelf(lastShelf);
          // Remaining shelves without the deleted one.
          var remainingShelves = [];
          for (var i = 0; i < iLength - 1; i++) {
            remainingShelves.push(this._lShelves[i]);
            this._lShelves[i] = null;
          }
          this._lShelves[iLength - 1] = null;
          this._lShelves = null;
          this._lShelves = remainingShelves;
        }
      }
      // Create new shelf
      var oShelf = new Cotton.UI.Stand.Manager.Shelf({
        'tomorrow': fTomorrow,
        'time': lStoriesForPeriod[0].lastVisitTime(),
        'isCompleteMonth': bIsCompleteMonth
      }, this._oGlobalDispatcher);
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
    this._unloading();
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

    if (this._lShelves.length === 0) {
      this._oGlobalDispatcher.unsubscribe('window_scroll', this);
      this._$manager.append(this._$no_story);
      this._bEnd = true;
    }
  },

  fillScreen : function() {
    var TOPBAR_HEIGHT = 74;
    if (!this._bEnd && this._$container.height() + TOPBAR_HEIGHT <=  $(window).height()) {
      this._oGlobalDispatcher.publish('need_more_stories', {
        'fLastVisitTime': this.hashUptoDate()['last']['lastVisitTime']
      });
      this._loading();
    }
  },

  _endOfManager : function() {
    var self = this;
    this._bEnd = true;
    var $end_of_history = $('<div class="ct-footer ct-end_of_history">'
    + '<span class="ct-footer ct-underline">cotton</span>Tracks</div>');
    this._$load_more.hide();

    var $rate_us = $('<div class="ct-footer">Rate us</div>').click(function() {
        self._oGlobalDispatcher.publish('toggle_ratings');
    });
    this._$container.removeClass('ct-footer_spacer');
    this._$manager.append($end_of_history, $rate_us);
    this._oGlobalDispatcher.unsubscribe('window_scroll', this);
  },

  _loading : function() {
    this._bReadyToLoad = false;
    this._$load_more.show();
    this._$container.removeClass('ct-footer_spacer');
  },

  _unloading : function() {
    this._bReadyToLoad = true;
    this._$load_more.hide();
    this._$container.addClass('ct-footer_spacer');
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

  collapseShelf : function(shelfToCollapse) {
    // Collapse the cover_container and the timestamp in 0.6s.
    shelfToCollapse.hide();
    setTimeout(function(){
      // We wait for the animation to be done, then we can purge the shelf.
      shelfToCollapse.purge();
      shelfToCollapse = null;
    }, 600);
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
  },

  hashUptoDate : function() {
    if (this._lShelves.length > 0) {
      // TODO(rmoutard): clean this.
      var oFirstStory = this._lShelves[0]._oCoversContainer.first().story();
      var oLastStory = this._lShelves[this._lShelves.length - 1]._oCoversContainer.last().story();
      return {
        'first': {
          'id': oFirstStory.id(),
          'lastVisitTime' : oFirstStory.lastVisitTime()
        },
        'last': {
          'id': oLastStory.id(),
          'lastVisitTime' : oLastStory.lastVisitTime()
        }
      };
    }
  }

});
