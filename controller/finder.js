'use strict';
/**
 * Controller
 *
 * Inspired by MVC pattern.
 *
 * Handles all the search requests.
 *
 */
Cotton.Controllers.Finder = Class.extend({

  /**
   * Global Store, that allow controller to make call to
   * the database. So it Contains 'historyItems', 'stories' and 'searchKeywords'.
   */
  _oDatabase : null,

  _oGlobalDispatcher : null,

  init : function(oDatabase, oGlobalDispatcher) {
    this._oDatabase = oDatabase;
    this._oGlobalDispatcher = oGlobalDispatcher;
  },

  /**
   * Given a sQuery return a list of stories that match the query.
   *
   * @param {String} sQuery:
   */
  search : function(sQuery, mCallback) {
    var lQueryWords = this._cutQuery(sQuery);
    var sPrefix = lQueryWords[0].substring(0,2);
    var sUpperBound = this._nextChar(sPrefix);
    var mConstraint = function(s) { return true; };
    this._oDatabase.getKeyRangeWithConstraint("searchKeywords", "sKeyword", sPrefix, sUpperBound,
        function(lKeywords) {
          mCallback(lKeywords);
        },

        function(dRecord) {
          return true;
        })
  },

  /**
   * Given a prefix return a list of words that match the prefix and so that
   * are good for autocompletion.
   *
   * @param {String} sPrefix:
   */
  autocomplete : function(sPrefix, mCallback) {
    var sUpperBound = this._nextWord(sPrefix);
    this._oDatabase.getXItemsWithBound('searchKeywords', 10, 'sKeyword',
      'NEXT', sPrefix, sUpperBound, false,
      function(lKeywords) {
        var lPossibleKeywords = [];
        for (var i = 0; i < lKeywords.length; i++) {
          lPossibleKeywords.push(lKeywords[i].keyword());
        }
        mCallback(lPossibleKeywords)
      });
  },

  /**
   * Given the query (in the search field.) return a list of
   * words.
   *
   * @param {String} sQuery:
   */
  _cutQuery : function(sQuery) {
    var lSearchWords = (sQuery.length > 0) ? sQuery.split(' ') : [];
    return lSearchWords;
  },

  /**
   * return the levenstein distance between 2 words.
   */
  _levenstein : function(sWord1, sWord2) {
    return 0;
  },

  /**
   * Return the next char in alphabetic order.
   * a -> b
   * z -> {
   */
  _nextChar : function(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
  },

  /**
   * Return the next char in alphabetic order.
   * aa -> ab
   */
  _nextWord : function(sWord) {
    var sNextWord = sWord.substring(0, sWord.length - 1);
    var c = sWord[sWord.length - 1];
    return sNextWord + String.fromCharCode(c.charCodeAt(c.length -1) + 1);
  },


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
});

