'use strict';

Cotton.Config.Parameters = {
  // Pretreatment
  lTools : [ 'mail.google.com', 'accounts.google.com',
      'continuousintegration.corp.ltutech.com', 'docs.google.com',
      'grooveshark.com', 'github.com', 'www.facebook.com', 'www.deezer.com',
      'www.wordreference.com', 'twitter.com' ],
  lExcludePatterns : [
      '^(https?://www.google.com/url)', '^(https?://www.google.fr/url)',
      '^(https?://www.google.com/webhp)', '^(https?://www.google.fr/webhp)',
      '^(https?://www.google.fr/accounts/)', '^(https?://www.google.fr/accounts/)' ],
  iSliceTime : 1000 * 60 * 5, // closestGeneratedPages

  // threshold percentage of the history for an expression to be banned
  iMinRecurringPattern : 0.15,

  // DBSCAN2
  dbscan2 : {
    fEps : 26,
    iMinPts : 3,
    iMaxScore : 26
  },

  // DBSCAN3
  dbscan3 : {
    iMaxResult : 10000, // The maximum number of results to retrieve in the
    fEps : 26,
    iMinPts : 3,
  },

  // BAG OF WORDS
  scoreForExtractedWords : 3,
  scoreForStrongQueryWords : 5,
  scoreForWeakQueryWords : 2,

  // PREPONDERANT KEYWORDS
  iNumberOfPreponderantKeywords : 3,

  // PROD
  bDevMode : true,
  bActiveSumup : false,
  bAnalytics : false,
  bLoggingEnabled : true,
};
