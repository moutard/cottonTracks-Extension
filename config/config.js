'use strict';

Cotton.Config.Parameters = {
  // Pretreatment
  lTools : [ 'mail.google.com', 'accounts.google.com',
      'continuousintegration.corp.ltutech.com', 'docs.google.com',
      'grooveshark.com', 'github.com', 'www.facebook.com', 'www.deezer.com',
      'www.wordreference.com', 'twitter.com' ],
  lExcludeUrls : [
      'http://www.google.fr/webhp?sourceid=chrome-instant&ie=UTF-8',
      'http://www.google.com/webhp?sourceid=chrome-instant&ie=UTF-8' ],
  lExcludePatterns : [
    'http://www.google.fr/url*', 'http://www.google.com/url*',
    'https://www.google.fr/url*', 'https://www.google.com/url*',
    'http://www.google.fr/webhp*', 'http://www.google.com/webhp*',
    'https://www.google.fr/webhp*', 'https://www.google.com/webhp*',
    'http://www.google.fr/accounts/*', 'http://www.google.com/accounts/*',
    'https://www.google.fr/accounts/*', 'https://www.google.com/accounts/*'
  ],
  iSliceTime : 1000 * 60 * 5, // closestGeneratedPages

   // DBSCAN2
  dbscan2 : {
    fEps : 17,
    iMinPts : 6,
  },

  // DBSCAN3
  dbscan3 : {
    iMaxResult : 10000, // The maximum number of results to retrieve in the
    fEps : 17,
    iMinPts : 6,
  },

  // BAG OF WORDS
  scoreForExtractedWords : 3,
  scoreForQueryWords : 5,

  // PROD
  bDevMode : true,
  bActiveSumup : false,
  bAnalytics : false,
  bLoggingEnabled : true,
};
