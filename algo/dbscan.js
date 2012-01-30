
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
      }
    }    
  } 
};

function expandCluster(lSetOfPoints, oPoint, iClusterId, fEps, iMinPts ){
  // Check if we can expand a cluster
  
  return false;
};

function regionQuery(lSetOfPoints, oPoint, fEps){
  // return the Eps-Neighborhood i.e. all the point in lSetOfPoints that are 
  // close to oPoint (distance <= Eps)
  
  // TODO : (rmoutard) implement R*-Tree to a (n*log(n))complexity
  
  var lEpsNeighborhood = [];
  for( var oCurrentPoint in lSetOfPoints ){
    if( distance(oCurrentPoint, oPoint) <= fEps ){
      lEpsNeighborhood.push(oCurrentPoint);
    }
  }
  
  return lEpsNeighborhood;
};