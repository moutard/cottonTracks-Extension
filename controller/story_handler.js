'use strict';
/**
 * Controller
 *
 * Inspired by MVC pattern.
 *
 * Handles all specific database requests link to a story like fill, filter.
 *
 */
Cotton.Controllers.StoryHandler = Class.extend({

  /**
   * Global Store, that allow controller to make call to
   * the database. So it Contains 'historyItems', 'stories' and 'searchKeywords'.
   */
  _oDatabase : null,

  /**
   * {Cotton.Controller.Dispatcher} oDispatcher
   */
  _oDispatcher : null,

  init : function(oDatabase, oDispatcher) {
    this._oDatabase = oDatabase;
    this._oDispatcher = oDispatcher;
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

  fillAndFilterStories : function(lStories, mCallback) {
    var self = this;
    var lFilledStories = [];
    var iLength = lStories.length;
    if (iLength === 0) {
      mCallback(lFilledStories);
    }
    for (var i = 0; i < iLength; i++) {
      this.fillStory(lStories[i], function(oFilledStory) {
        lFilledStories.push(oFilledStory);
        if (lFilledStories.length === iLength) {
          mCallback(self._filterEmptyStories(lFilledStories));
        }
      });
    }
  }

});

