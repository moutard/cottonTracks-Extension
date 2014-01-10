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

  /**
   * {Cotton.Controller.Dispatcher} oGlobalDispatcher
   */
  _oGlobalDispatcher : null,

  /**
   * {Cotton.Controller.StoryHandler} oStoryHandler
   */
  _oStoryHandler : null,

  init : function(oDatabase, oStoryHandler, oGlobalDispatcher) {
    this._oDatabase = oDatabase;
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._oStoryHandler = oStoryHandler;
  },

  /**
   * Given a sQuery return a list of stories that match the query.
   *
   * @param {String} sQuery: it's just a simple word.
   */
  search : function(sQuery, mCallback) {
    var self = this;
    var lQueryWords = this._cutQuery(sQuery);
    self._getKeywords(lQueryWords, function(lSearchKeywords) {
      self._getDirectRelatedStories(lSearchKeywords, function(lStories) {
      mCallback(lStories, sQuery);
      });
    });
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
    // Cut words seperated by a space " ".
    // we can imagine more.
    var oRegExp = new RegExp("[\\ ]", "g");
    var lSearchWords = (sQuery.length > 0) ? sQuery.split(oRegExp) : [];
    return lSearchWords;
  },

  /**
   * Return the levenshtein distance between 2 words.
   * Not implemented by me, but seems the most optimized one.
   * http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript
   * See more at the end of the file.
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


  /**
   * Create a function that return true if the constraint is valid
   * and false if the the constraint is not verified.
   *
   * @param {String} sQuery:
   *                query words you want to compare with words
   *   in the database.
   * @param {Float} fThreshold:
   *                the maximum distance you can tolerate.
   * @param {Function} mDistance:
   *                the distance between 2 words.
   *
   */
  _makeConstraint : function(sQuery, fThreshold, mDistance) {
    return function(dDBRecord) {
      var sWord = dDBRecord['sKeyword'];
      return mDistance(sWord, sQuery) < fThreshold;
    };
  },

  /**
   * For each words written by the user, return an list of words present in
   * the database that are close to the user query word. (i.e where the
   * levenshtein distance < iMaxLenvenshteinDistance)
   * return a list of Model.SearchKeywords that can match with words of the query.
   * @param {Array.<string>} lQueryWords: list of words written by the user.
   */
  _getKeywords : function(lQueryWords, mCallback) {
    var self = this;
    // PARAMETERS.
    // To speed the query, we don't want scan all the searchKeywords.
    // Because each time we scan a searchKeywords we compute the lenvenshtein
    // distance that costs.
    var iLengthPrefix = 2;

    // To make the constraint.
    var fMaxLenvenshteinDistance = 3.0;

    var lAllKeywords = [];
    var iCount = 0;

    for (var i = 0; i < lQueryWords.length; i++) {
        // Get all the words comprise between the prefix and the next char.
      this._oDatabase.find("searchKeywords", "sKeyword", lQueryWords[i],
          function(oSearchKeyword, sQueryWord) {
            if (oSearchKeyword) {
              iCount++;
              lAllKeywords.push(oSearchKeyword);
              if (iCount === lQueryWords.length) mCallback(lAllKeywords);
            } else {
              self._getClosestKeywordWithLevenshtein(sQueryWord, function(oSearchKeyword) {
                lAllKeywords.push(oSearchKeyword);
                iCount++;
                if (iCount === lQueryWords.length) mCallback(lAllKeywords);
              });
            }
      });
    }

  },

  _getClosestKeywordWithLevenshtein : function(sQueryWord, mCallback) {
      var self = this;
      var sPrefix = sQueryWord.substring(0,2);
      var sUpperBound = this._nextChar(sPrefix);
      var mConstraintGenerated = this._makeConstraint(sQueryWord, 3.0,
            this._levenshtein);

      this._oDatabase.getKeyRangeWithConstraint("searchKeywords", "sKeyword",
        sPrefix, sUpperBound,
        // Callback.
        function(lKeywords) {
            lKeywords = _.sortBy(lKeywords, function(oSearchKeyword){
              return self._levenshtein(oSearchKeyword.keyword(), sQueryWord);
            });
            mCallback(lKeywords[0]);
        },
        // Constraint.
        mConstraintGenerated
      );
  },

  /**
   * Get directly directed stories. (i.e. the id of the story is in the list
   * referringStoriesId of the searchKeyword.
   */
  _getDirectRelatedStories : function(lSearchKeywords, mCallback) {
    var self = this;
    var lRelatedStoriesId = [];
    var iLength = lSearchKeywords.length;

    // Only keep stories that match all the keywords.
    var lAllStoriesIdByKeywords = [];
    for (var i = 0; i < iLength; i++) {
      lAllStoriesIdByKeywords.push(lSearchKeywords[i].referringStoriesId());
    }
    console.log(lAllStoriesIdByKeywords);
    var lRelatedStoriesId = _.intersection.apply(null, lAllStoriesIdByKeywords);
    console.log(lRelatedStoriesId);
    self._getStoriesAndScore(lRelatedStoriesId, 2, mCallback);
  },

  _getStoriesAndScore : function(lStoriesId, iPrecision, mCallback, iExpectedResults) {
    var self = this;
    // Get all the reffering stories.
    self._oDatabase.findGroup('stories', 'id', lStoriesId, function(lStories) {
      lStories = lStories || [];

      // Set the items in the stories, filter the search & images doubles
      // and filter empty stories.
      self._oStoryHandler.fillAndFilterStories(lStories, function(lFilteredStories){
        // Crop number of results if asked
        if (iExpectedResults) lFilteredStories = lFilteredStories.slice(0, iExpectedResults);

        // TODO(rmoutard): Sort by distance between the query and the oStory result.

        if (mCallback) {
          mCallback(lFilteredStories);
        }

      });
    });
  },

});

/**
 * Understand Search.
 *
 * - Given a query as a text.
 * - Find each words in the query.
 * - For each words find all the keywords that match a specific constraint.
 *
 * - - The constraint is simple the levenshtein distance is less than a threshold.
 * - - We do not take the closest one for
 *   performance reason, because it could imply to store the k closest and compare
 *   each time.
 *
 * The levenshtein distance compare the number of permutation modification we
 * need to go from the query to the searchKeywords. It's really a complexe
 * operation. So we need to avoid to to compute it too often.
 *
 * - for this we use a simpler constraint.
 *   the searchKeywords and the queryWords
 *   has to start with the same letter.
 */
