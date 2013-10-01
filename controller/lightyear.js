'use strict';
/**
 * Controller
 *
 * Inspired by MVC pattern.
 *
 * Handles DB, and UI.
 *
 */
Cotton.Controllers.Lightyear = Class.extend({

  /**
   * Global Store, that allow controller to make call to
   * the database. So it Contains 'historyItems', 'stories' and 'searchKeywords'.
   */
  _oDatabase : null,

  /**
   * Messenger for handling core message. (Chrome message)
   */
  _oCoreMessenger : null,

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * Global view, contains the Manager, the StoryContainer.
   * UI elements act as their own controllers.
   */
  _oWorld : null,

  /**
   * {Int} number of stories you get each time.
   */
  _BATCH_SIZE : 25,

  /**
   * {Int} number of stories already delivered (empty stories are counted),
   * it's exaclty the position in the database where we stopped. It corresponds
   * to iStart in _getBatchStory
   */
  _iStoriesDelivered : 0,

  /**
   * @param {Cotton.Core.Messenger} oCoreMessenger
   */
  init : function(oCoreMessenger) {
    var self = this;

    LOG && DEBUG && console.debug("Controller Lightyear - init -");

    this._oCoreMessenger = oCoreMessenger;
    this._oGlobalDispatcher = new Cotton.Messaging.Dispatcher();
    this._oDispatchingController = new Cotton.Controllers.DispatchingController(this, this._oGlobalDispatcher);

    this._oWorld = new Cotton.UI.World(oCoreMessenger, self._oGlobalDispatcher);
    this._oDatabase = new Cotton.DB.IndexedDB.Wrapper('ct', {
        'stories' : Cotton.Translators.STORY_TRANSLATORS,
        'historyItems' : Cotton.Translators.HISTORY_ITEM_TRANSLATORS,
        'searchKeywords' : Cotton.Translators.SEARCH_KEYWORD_TRANSLATORS
    }, function() {
      self._oPopstater = new Cotton.Controllers.Popstater(self, self._oGlobalDispatcher);
    });

    self._oGlobalDispatcher.subscribe('need_more_stories', this, function(dArguments) {
      self._getStoriesByBatch(self._iStoriesDelivered, self._BATCH_SIZE,
        function(lStories) {
          self._iStoriesDelivered += self._BATCH_SIZE;
          self._oGlobalDispatcher.publish('give_more_stories' , {'lStories': lStories});
      });
    });

  },

  database : function() {
    return this._oDatabase;
  },

  /**
   * Ask to the world to replace the Manager and open an UIStory instead.
   *
   * @param {Cotton.Model.Story} oStory:
   *        story that contains the data you want to display in the UIStory.
   */
  openStory : function(oStory) {
    this._oWorld.openStory(oStory);
  },

  /**
   * For a given story, set its list of historyItems without search pages,
   * youtube searches redundant maps or redundant images from image search
   * results + actual image url.
   *
   * @param {Array.<Cotton.Model.HistoryItems>}
   *        lHistoryItems: story that contains historyItems you want to filter.
   */
  _filterHistoryItems : function(lHistoryItems) {
    var self = this;

    // List of Cotton.Model.HistoryItem that are in the story and not exluded.
    var lHistoryItemsFiltered = [];

    // Use as a unique key to avoid duplicate elements.
    // Rq: historyItems are already unique by url, but when it's an image search
    // the image url can be the same but not the whole url.
    var lUrls = [];
    var lMapsSearch = [];
    var iLength = lHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      var oHistoryItem = lHistoryItems[i];
      var oUrl = oHistoryItem.oUrl();
      oUrl.fineDecomposition();
      // We filter google and Youtube searches, plus we eliminate redundancy
      // in images or maps.
      // FIXME(rmoutard -> rkorach): maybe use a specific method in
      // ExcludeContainer.
      if (!(oUrl.isGoogle && oUrl.dSearch)
        && !(oUrl.isYoutube && oUrl.dSearch['search_query'])
        || oUrl.isGoogleMaps
        || oUrl.searchImage) {
          if (oUrl.searchImage) {
            // Google image result, check if there is not already the image
            // itself in the url list
            if (lUrls.indexOf(oUrl.searchImage) === -1) {
              lUrls.push(oUrl.searchImage);
              lHistoryItemsFiltered.push(oHistoryItem);
            }
          } else if (oUrl.isGoogleMaps && (oUrl.dHash['!q'] || oUrl.dSearch['q'])) {
            // New or old google maps, keep only one page per query, independant of
            // the change of coordinates.
            var sMapCode = (oUrl.dHash['!q']) ? oUrl.dHash['!q'] : oUrl.dSearch['q'];
            if (lMapsSearch.indexOf(sMapCode.toLowerCase()) === -1) {
              lMapsSearch.push(sMapCode.toLowerCase());
              lHistoryItemsFiltered.push(oHistoryItem);
            }
          } else if (!oUrl.isGoogleMaps){
            // The map condition is because there are sometimes a lot of maps url
            // just with google.com/maps/preview#!data=3876582379281635767kjfzmj837L23U5Y3
            // useless.
            // Primarily for images, to avoid redundancy with google images
            // search.
            if (lUrls.indexOf(oUrl.href) === -1) {
              lUrls.push(oUrl.href);
              lHistoryItemsFiltered.push(oHistoryItem);
            }
          }
      }
    }
    return lHistoryItemsFiltered;
  },

  /**
   * For a given list of stories, filter their content, then keep only stories
   * that still have elements after the itemsFilter.
   * i.e. story that have at least one element that is not a search.
   *
   * @param Array.<Cotton.Model.Story> lStories:
   */
  _filterEmptyStories : function(lStories) {
    // Store stories that are non empty.
    var lNonEmptyStories = [];
    var iLength = lStories.length;
    for (var i = 0; i < iLength; i++) {
      var oStory = lStories[i];
      if (oStory.historyItems().length > 0) {
        lNonEmptyStories.push(oStory);
      }
    }
    return lNonEmptyStories;
  },

  fillStory : function(oStory, mCallback) {
    // if no story, send back null useful in the popstate controller, if we try to go to
    // the page of a story that does not exist
    if (!oStory){
      mCallback(null);
      return;
    }
    var self = this;
    // get all historyItems in this story using the base as a relational database
    self._oDatabase.search('historyItems', 'sStoryId',
      oStory.id(), function(lHistoryItems, iStoryId) {
        // Set the historyItems of the story.
        oStory.setHistoryItems(
          // Filter the items, and sort them by lastVisitTime
          self._filterHistoryItems(
            lHistoryItems.sort(function(a,b){
              return b.lastVisitTime()-a.lastVisitTime();
            })
          )
        );
        mCallback(oStory);
    });
  },

  /**
   * Get stories by batch from the database. But only get non empty stories.
   *
   * @param {Int}
   *        iStartStories: number of stories already in the manager.
   */
  _getStoriesByBatch : function(iStart, iBatchSize, mCallback) {
    var self = this;
    // loads a b(i)atch of iBatchSize stories.
    // TODO(rkorach) see if we cannot speed the performance + percieved speed up.
    self._oDatabase.getXYItems('stories', iStart, iStart + iBatchSize - 1,
        'fLastVisitTime', 'PREV',
      function(lStories) {
        // For each story get all the corresponding historyItems.
        var iCount = 0;
        var iLength = lStories.length;
        if (iLength === 0) {
          mCallback(lStories);
          return;
        }
        var lFilledStories = [];
        for (var i = 0; i < iLength; i++) {
          var oStory = lStories[i];
          self.fillStory(oStory, function(oFilledStory){
            iCount++;
            lFilledStories.push(oFilledStory);

            if (iCount === iLength) {
              mCallback(self._filterEmptyStories(
                lFilledStories.sort(function(a,b){
                  return (b.lastVisitTime() - a.lastVisitTime());
                })
              ));
            }
          });
        }
    });
  }

});

var oCoreMessenger = new Cotton.Core.Messenger();
Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear(oCoreMessenger);
