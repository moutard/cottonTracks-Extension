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
 * Specific cache database in localStorage that contains all the important
   * historyItems that can be used to generate a story.
   */
  _oPool : null,

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
    Cotton.ANALYTICS.openLightyear('any');

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
        function(lStories, bNoMoreStories) {
          self._iStoriesDelivered += self._BATCH_SIZE;
          self._oGlobalDispatcher.publish('give_more_stories' , {'lStories': lStories, 'bNoMoreStories': bNoMoreStories});
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
  openStory : function(oStory, lRelatedStories) {
    this._oWorld.openStory(oStory, lRelatedStories);
  },

  /**
   * Ask to the world to replace the Manager and open a Partial instead.
   *
   * @param {Array.<Cotton.Model.Story>} lPartialStories:
   *        story that contains the data you want to display in the UIPartial.
   */
  openPartial : function(lPartialStories, sPartialTitle, sEmptyMessage) {
    this._oWorld.openPartial(lPartialStories, sPartialTitle, sEmptyMessage);
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
	var fLastVisitTime = new Date().getTime();
	if (this._oWorld._oManager) {
		fLastVisitTime = this._oWorld._oManager.hashUptoDate()['last']['lastVisitTime'];
	}

    self._oDatabase.getXItemsWithUpperBound('stories', iBatchSize - 1,
        'fLastVisitTime', 'PREV', fLastVisitTime, true,
      function(lStories) {
        // For each story get all the corresponding historyItems.
        var iCount = 0;
        var iLength = lStories.length;
		// In this case we arrived at the end of the database.
		var bNoMoreStories = false;
		if (iLength < iBatchSize){ bNoMoreStories = true; }
        if (iLength === 0) {
          mCallback(lStories, bNoMoreStories);
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
              ), bNoMoreStories);
            }
          });
        }
    });
  },

  /**
   * returns the localstorage cache (pool) with the temp elements not set in a story
   */
  getPool : function() {
    if (!this._oPool) {
      this._oPool = new Cotton.DB.DatabaseFactory().getCache('pool');
    }
    return this._oPool;
  },

  /**
   * returns the items of the pool
   * @param {Cotton.DB.FixedSizeCache} : Pool of recent unclassified historyItems
   */
  getPoolItems : function(oPool, mCallback){
    var self = this;
    var lPoolRecordItems = oPool.get();
    var lIds = [];
    for (var i = 0, dHistoryItem; dHistoryItem = lPoolRecordItems[i]; i++){
      lIds.push(dHistoryItem['id']);
    }
    this._oDatabase.findGroup('historyItems', 'id', lIds, function(lPoolItems){
      if (mCallback){
        mCallback.call(self,lPoolItems);
      }
    });
  },

  getRelatedStoriesId : function(oStory, mCallback) {
    this._oDatabase.findGroup('searchKeywords', 'sKeyword', oStory.searchKeywords(),
      function(lSearchKeywords){
        var lRelatedStoriesId = [];
        var iLength = lSearchKeywords.length;
        for (var i = 0; i < iLength; i++) {
          var oSearchKeyword = lSearchKeywords[i];
          lRelatedStoriesId = _.union(lRelatedStoriesId, oSearchKeyword.referringStoriesId());
        };
        mCallback(lRelatedStoriesId);
    });
  },

  getStories : function(lStoriesId, mCallback) {
    this._oDatabase.findGroup('stories', 'id', lStoriesId, function(lRelatedStories){
      mCallback.call(this, lRelatedStories);
    });
  },

  /**
   * @param {Array.<String>} lSearchWords:
   *          each string is a word of the search.
   * @param {Int} iExpectedResults: number of results you want.
   * TODO(rmoutard): make a min score parameter.
   */
  searchStories : function(lSearchWords, mCallback, iExpectedResults) {
    var self = this;

    // For each ask keywords find corresponding stories.
    this._oDatabase.findGroup('searchKeywords', 'sKeyword', lSearchWords,
      function(lSearchKeywords) {
        var lRelatedStoriesId = [];
        var iLength = lSearchKeywords.length;
        for (var i = 0; i < iLength; i++) {
          var oSearchKeyword = lSearchKeywords[i];
          lRelatedStoriesId = _.union(lRelatedStoriesId,
            oSearchKeyword.referringStoriesId());
        }
        // For each stories
        self._oDatabase.findGroup('stories', 'id', lRelatedStoriesId,
          function(lStories) {
            lStories = lStories || [];

            // Set the items in the stories, filter the search & images doubles
            // and filter empty stories.
            self.fillAndFilterStories(lStories, function(lFilteredStories){
              // Crop number of results if asked
              if (iExpectedResults) lFilteredStories = lFilteredStories.slice(0, iExpectedResults);

              // Sort by score.
              // We create a story with the query words in its bag of words
              // to compare it to the other stories.
              var oRefStory = new Cotton.Model.Story();
              for (var i = 0; i < iLength; i++) {
                oRefStory.dna().addWord(lSearchKeywords[i].keyword(), 1);
              }
              lFilteredStories.sort(function(a,b){
                return (Cotton.Algo.Score.Object.storyToStory(b, oRefStory)
                  - Cotton.Algo.Score.Object.storyToStory(a, oRefStory))
              });

              if (mCallback) {
                mCallback.call(this, lFilteredStories, lSearchWords.join(' '));
              }

            });
        });
    });
  }, 
  
  /**
   * return true if there is no change until the last time we visit
   * lightyear.
   * To simply compute this we use a simple hash function that compare the
   * last story in the database and the last story in the manager,
   * storyiId and lastvisittime
   */
  isUpToDate : function(mCallback) {
    var dHash = this._oWorld._oManager.hashUptoDate();
	this._oDatabase.getLast('stories', 'fLastVisitTime', function(oStory){
        var iCurentId = dHash['first']['id'];
		var iCurrentVisitTime = dHash['first']['lastVisitTime'];
        var bIsUpToDate = oStory.id() === iCurentId && oStory.lastVisitTime() === iCurrentVisitTime;
        return mCallback(bIsUpToDate);
	});
  }

});

var oCoreMessenger = new Cotton.Core.Messenger();
Cotton.Controllers.LIGHTYEAR = new Cotton.Controllers.Lightyear(oCoreMessenger);
