
function initSetOfPoints(lSetOfPoints){
  // Mark all the point as UNCLASSIFIED
  
  for(points in lSetOfPoints){
    points.clusterId = 'UNCLASSIFIED';
  }
};

function DBSCAN (lSetOfPoints, fEps, iMinPts){
  // Main part of the algorithm
  
  var iClusterId = 0;
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

function expandCluster(lSetOfPoints, oPoint, iClusterId, fEps, iMinPts ){
  // Check if we can expand a cluster
  
  lSeeds = regionQuery(lSetOfPoints, oPoint, fEps);
  
  if( lSeeds.length <= iMinPts ){
    oPoint.clusterId = 'NOISE';
    return false;
  }
  else{
    // all the point in seeds are density reachable from point
    for( var oSeedsPoint in lSeeds ){
      oSeedsPoint.clusterId = iClusterId;
      
      // remove oPoint
      // TODO(rmoutard): oPoint should be the closest point maybe find a way to put it
      // in the first position
      var idx = lSeeds.indexOf(oPoint);   // Find the index
      if(idx!=-1) lSeeds.splice(idx, 1);  // Remove it if really found!
      
      while(lSeeds.length == 0){
        oCurrentPoint = seeds.pop();
        lResult = regionQuery(lSetOfPoints, oCurrentPoint, fEps);
        
        if( lResult.length >= iMinPts ){
          
          for( oCurrentSeed in lSeedsPoint ){
            if( oCurrentSeed.clusterId === 'UNCLASSIFIED' || oCurrentSeed.clusterId === 'NOISE' ){
              if(oCurrentSeed.clusterID === 'UNCLASSIFIED'){
                lSeeds.push(oCurrentSeed);
              }
              var idx = lResult.indexOf(oPoint);   // Find the index
              lResult[idx].clusterId = iClusterId;
              //if(idx!=-1) lResult.splice(idx, 1);  // Remove it if really found!
              
            }
          }
        } // End of Noise and Unclassified 
      }
    }
    return true;
  }
  
};

function regionQuery(lSetOfPoints, oPoint, fEps){
  // return the Eps-Neighborhood i.e. all the point in lSetOfPoints that are 
  // close to oPoint (distance <= Eps)
  
  // TODO(rmoutard): implement R*-Tree to a (n*log(n))complexity
  
  var lEpsNeighborhood = [];
  for( var oCurrentPoint in lSetOfPoints ){
    if( distance(oCurrentPoint, oPoint) <= fEps ){
      lEpsNeighborhood.push(oCurrentPoint);
    }
  }
  
  // TODO(rmoutard): remove console.log
  console.log("regionQuery oPoint:" + oPoint + " length " +lEpsNeighborhood.length);
  return lEpsNeighborhood;
};