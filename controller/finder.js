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
   * @param {String} sQuery: it's just a simple word.
   */
  search : function(sQuery, mCallback) {
    var lQueryWords = this._cutQuery(sQuery);
    var sPrefix = lQueryWords[0].substring(0,2);
    var sUpperBound = this._nextChar(sPrefix);
    var mConstraintGenerated = this._makeConstraint(sQuery, 3.0, this._levenshtein);
    // Get all the words comprise between the prefix and the next char.
    // So if prefix is "pr" return "prototype", "prisonner" but not "q".
    this._oDatabase.getKeyRangeWithConstraint("searchKeywords", "sKeyword", sPrefix, sUpperBound,
        // Callback.
        function(lKeywords) {
          mCallback(lKeywords);
        },
        // Constraint.
        mConstraintGenerated);
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
   * Return the levenshtein distance between 2 words.
   * Not implemented by me, but seems the most optimized one.
   * http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript
   */
  _levenshtein : function(s, t) {
    var d = []; // 2d matrix.

    // Step 1
    var n = s.length;
    var m = t.length;

    if (n == 0) return m;
    if (m == 0) return n;

    // Create an array of arrays in javascript (a descending loop is quicker).
    for (var i = n; i >= 0; i--) d[i] = [];

    // Step 2.
    for (var i = n; i >= 0; i--) d[i][0] = i;
    for (var j = m; j >= 0; j--) d[0][j] = j;

    // Step 3.
    for (var i = 1; i <= n; i++) {
        var s_i = s.charAt(i - 1);

        // Step 4.
        for (var j = 1; j <= m; j++) {

            // Check the jagged ld total so far.
            if (i == j && d[i][j] > 4) return n;

            var t_j = t.charAt(j - 1);
            var cost = (s_i == t_j) ? 0 : 1; // Step 5

            //Calculate the minimum
            var mi = d[i - 1][j] + 1;
            var b = d[i][j - 1] + 1;
            var c = d[i - 1][j - 1] + cost;

            if (b < mi) mi = b;
            if (c < mi) mi = c;

            d[i][j] = mi; // Step 6

            //Damerau transposition
            if (i > 1 && j > 1 && s_i == t.charAt(j - 2) && s.charAt(i - 2) == t_j) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
            }
        }
    }

    // Step 7
    return d[n][m];
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


  _makeConstraint : function(sQuery, fThreshold, mDistance) {
    return function(dDBRecord) {
      var sWord = dDBRecord['sKeyword'];
      return mDistance(sWord, sQuery) < fThreshold;
    };
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

