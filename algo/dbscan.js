'use strict';

function initSetOfPoints(lSetOfPoints) {
  // Mark all the point as UNCLASSIFIED
  for (var iLoop = 0; iLoop < lSetOfPoints.length; iLoop++){
    lSetOfPoints[iLoop].clusterId = 'UNCLASSIFIED';
  }
};

function DBSCAN (lSetOfPoints, fEps, iMinPts) {
  // Main part of the algorithm
  
  // 
  initSetOfPoints(lSetOfPoints);
  
  var iClusterId = 0;
  var oPoint;
  for( var iLoop = 0; iLoop < lSetOfPoints.length; iLoop++ ){
    oPoint = lSetOfPoints[iLoop];
    
    if( oPoint.clusterId == 'UNCLASSIFIED' ){
      if( expandCluster(lSetOfPoints, oPoint, iClusterId, fEps, iMinPts) ){
        iClusterId++;
        
        // TODO(rmoutard) : remove console.log
        console.log("ClusterId" + iClusterId);
      }
    }    
  }
  
  //TODO(rmoutard) : remove console.log
  console.log("end of dbscan");
  return iClusterId;
};

function expandCluster(lSetOfPoints, oPoint, iClusterId, fEps, iMinPts ) {
  // Check if we can expand a cluster
  
  var lSeeds = regionQuery(lSetOfPoints, oPoint, fEps);
  
  if( lSeeds.length <= iMinPts ){
    oPoint.clusterId = 'NOISE';
    return false;
  }
  else{
    // all the point in seeds are density reachable from point
    
    // change all the cluster id of seeds
    for( var iSeedPoint = 0; iSeedPoint < lSeeds.length; iSeedPoint++ ){
      lSeeds[iSeedPoint].clusterId = iClusterId;
    }
    
    // remove oPoint
    // TODO(rmoutard): oPoint should be the closest point maybe find a way to put it
    // in the first position
    var idx = lSeeds.indexOf(oPoint);   // Find the index
    if(idx!=-1) lSeeds.splice(idx, 1);  // Remove it if really found!
    
    var oCurrentSeedPoint;
    while(lSeeds.length != 0){
        
      oCurrentSeedPoint = lSeeds.pop();
      
      // lResult is the neighborhood of the CurrentSeedPoint
      var lResult = regionQuery(lSetOfPoints, oCurrentSeedPoint, fEps);
        
      if( lResult.length >= iMinPts ){
          
        for( var iResultIndex = 0; iResultIndex < lResult.length; iResultIndex++ ){
          
          var oCurrentResultPoint = lResult[iResultIndex];
          if( oCurrentResultPoint.clusterId === 'UNCLASSIFIED' || oCurrentResultPoint.clusterId === 'NOISE' ){
            if(oCurrentResultPoint.clusterID === 'UNCLASSIFIED'){
              lSeeds.push(oCurrentResultPoint);
            }
            
            // SetOfPoints.changeClId(resultP,ClId);
            
            // TODO(rmoutard) : check if lResult change lSetOfPoints
            lResult[iResultIndex].clusterId = iClusterId;
              
          }
        }
      } // End of Noise and Unclassified
    } // End of While 
  return true;
  }
 };

function regionQuery(lSetOfPoints, oPoint, fEps) {
  // return the Eps-Neighborhood i.e. all the point in lSetOfPoints that are 
  // close to oPoint (distance <= Eps)
  
  // TODO(rmoutard): implement R*-Tree to a (n*log(n))complexity
  
  var lEpsNeighborhood = [];
  for ( var iCurrentLoop = 0; iCurrentLoop < lSetOfPoints.length; iCurrentLoop++ ){
    if( distanceComplexe(lSetOfPoints[iCurrentLoop], oPoint) <= fEps ){
      lEpsNeighborhood.push(lSetOfPoints[iCurrentLoop]);
    }
  }
  
  // TODO(rmoutard): remove console.log
  console.log("regionQuery oPoint:" + oPoint + " length " +lEpsNeighborhood.length);
  return lEpsNeighborhood;
};
