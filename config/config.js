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
  lExcludePatterns : [ 'http://www.google.fr/url*',
      'http://www.google.com/url*', 'https://www.google.fr/webhp*',
      'https://www.google.fr/webhp*', 'http://www.google.fr/accounts/*',
      'http://www.google.com/accounts/*' ],
  iSliceTime : 1000 * 60 * 5, // closestGeneratedPages

  // DBSCAN
  fEpsTime : 1000 * 60 * 5,
  fEps : 0.40, // Max Distance between neighborhood
  iMinPts : 5, // Min Points in a cluster
  iMaxResult : 1000, // The maximum number of results to retrieve in the
  // chrome history
  distanceCoeff : {
    id : 0.10,
    lastVisitTime : 0.35,
    commonWords : 0.50,
    queryKeywords : 0.20,
    penalty : 0.1,
  },

  // storySELECT
  bUseRelevance : true,
  iMaxNumberOfStories : 10,
  computeRelevanceCoeff : {
    'length' : 0.2,
    'lastVisitTime' : 0.2,
    'hostname' : 0.2,
    'search' : 0.2
  },
  // DBSCAN2

  // UI
  sGrid : "MostVisited", // choose among "MostVisited" or "Favorites"
  iNbMostVisited : 8,

  // PROD
  bDevMode : false,
  bActiveSumup : false,
  bAnalytics : false,
  bLoggingEnabled : false,
};
