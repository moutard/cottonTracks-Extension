'use strict';

Cotton.Algo.initSetOfPoints = function(lSetOfPoints) {
  // Mark all the point as UNCLASSIFIED
  var iLength = lSetOfPoints.length;
  for ( var iLoop = 0; iLoop < iLength; iLoop++) {
    lSetOfPoints[iLoop]['clusterId'] = 'UNCLASSIFIED';
  }
};

Cotton.Algo.regionQuery = function(lSetOfPoints, oPoint, fEps, mDistance) {
  // return the Eps-Neighborhood i.e. all the point in lSetOfPoints that are
  // close to oPoint (distance <= Eps)

  // TODO(rmoutard): implement R*-Tree to a (n*log(n))complexity
  var lEpsNeighborhood = [];
  var iLength = lSetOfPoints.length;
  for ( var iCurrentLoop = 0; iCurrentLoop < iLength; iCurrentLoop++) {
    if (mDistance(lSetOfPoints[iCurrentLoop], oPoint) >= fEps) {
      lEpsNeighborhood.push(lSetOfPoints[iCurrentLoop]);
    }
  }

  return lEpsNeighborhood;
};

Cotton.Algo.expandCluster = function(lSetOfPoints, oPoint, iClusterId, fEps,
    iMinPts, mDistance) {
  // Check if we can expand a cluster

  // get fEps-Neighborhood of oPoint
  var lSeeds = Cotton.Algo.regionQuery(lSetOfPoints, oPoint, fEps, mDistance);

  var iLength = lSeeds.length;
  if (iLength < iMinPts) {
    // the fEps-Neighborhood is not wide enough to create a cluster

    oPoint['clusterId'] = 'NOISE';
    return false;
  } else {
    // all the points in the fEps-Neighborhood are density reachable from oPoint

    // Update the clusterId of all the points in the fEps-Neighborhood
    for ( var iSeedPoint = 0; iSeedPoint < iLength; iSeedPoint++) {
      lSeeds[iSeedPoint]['clusterId'] = iClusterId;
    }

    // remove oPoint
    var idx = lSeeds.indexOf(oPoint); // Find the index
    if (idx != -1)
      lSeeds.splice(idx, 1); // Remove it if really found!

    var oCurrentSeedPoint;
    while (lSeeds.length != 0) {

      oCurrentSeedPoint = lSeeds.pop();

      // lResult is the fEps-Neighborhood of the oCurrentSeedPoint
      var lResult = Cotton.Algo.regionQuery(lSetOfPoints, oCurrentSeedPoint,
          fEps, mDistance);

      var iLength = lResult.length;
      if (iLength >= iMinPts) {

        for ( var iResultIndex = 0; iResultIndex < iLength; iResultIndex++) {

          var oCurrentResultPoint = lResult[iResultIndex];
          if (oCurrentResultPoint['clusterId'] === 'UNCLASSIFIED'
              || oCurrentResultPoint['clusterId'] === 'NOISE') {
            // if NOISE then we were wrong now the point is in the cluster
            // if UNCLASSIFIED the point is in the cluster and ...
            if (oCurrentResultPoint['clusterId'] === 'UNCLASSIFIED') {
              // ...we had it in the seeds to check its fEps-Neighborhood
              lSeeds.push(oCurrentResultPoint);
            }

            // SetOfPoints.changeClId(resultP,ClId);
            lResult[iResultIndex]['clusterId'] = iClusterId;

          }
        }
      } // End of Noise and Unclassified
    } // End of While
    return true;
  }
};

Cotton.Algo.DBSCAN = function(lSetOfPoints, fEps, iMinPts, mDistance) {
  // Main part of the algorithm

  // Mark all the point as UNCLASSIFIED
  Cotton.Algo.initSetOfPoints(lSetOfPoints);

  var iClusterId = 0; // current clusterId
  var oPoint; // current point

  var iLength = lSetOfPoints.length;
  for ( var iLoop = 0; iLoop < iLength; iLoop++) {
    oPoint = lSetOfPoints[iLoop];

    if (oPoint['clusterId'] === 'UNCLASSIFIED') {
      if (Cotton.Algo.expandCluster(lSetOfPoints, oPoint, iClusterId, fEps,
          iMinPts, mDistance)) {
        iClusterId++;

      }
    }
  }

  return iClusterId;
};
