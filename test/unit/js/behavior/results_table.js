'use strict';

google.load('visualization', '1', {packages:['table']});

var mDrawTable = function(oAllResults) {
  var iLen = oAllResults.length;
  // Totals
  var fTotalTime = 0;
  var iTotalExpected = 0;
  var iTotalMeaningful = 0;
  var iTotalMissings = 0;
  var iTotalFalsePositives = 0;
  var iTotalError = 0;

  var iAverageTime = 0;
  var iAverageExpected = 0;
  var iAverageMeaningful = 0;
  var iAverageMissings = 0;
  var iAverageFalsePositives = 0;
  var iAverageError = 0;

  var oData = new google.visualization.DataTable({
    'cssClassNames': {
      'headerRow': 'results-header'
    }
  });
  oData.addColumn('string', 'Id');
  oData.addColumn('string', 'Path');
  oData.addColumn('number', 'Elapsed time (ms)');
  oData.addColumn('boolean', 'Image');
  oData.addColumn('number', 'Expected');
  oData.addColumn('number', 'Meaningful');
  oData.addColumn('number', 'Missings');
  oData.addColumn('number', 'False Positives');
  oData.addColumn('number', 'Error %');
  for (var i = 0; i < iLen; i++) {
    var oResults = oAllResults[i];
    var fElapsedTime = Number((oResults['time']['end'] - oResults['time']['start']).toFixed(2));
    var iExpected = Number(oResults.expected);
    var iMeaningful = Number(oResults.meaningful);
    var iMissings = Number(oResults.missings);
    var iFalsePositives = Number(oResults.false_positives);
    var iError = Number((100 * ((iMissings + iFalsePositives) /
      (iExpected + iMeaningful))).toFixed(2));
    oData.addRows([
      [oResults['id'], oResults['path'], fElapsedTime, oResults.image,
      iExpected, iMeaningful, iMissings, iFalsePositives , iError]
    ]);
    fTotalTime += fElapsedTime;
    iTotalExpected += iExpected;
    iTotalMeaningful += iMeaningful;
    iTotalMissings += iMissings;
    iTotalFalsePositives += iFalsePositives;
    iTotalError += iError;
  };
  oData.addRows([
      ['Total', null, Number(fTotalTime.toFixed(2)), null, iTotalExpected,
      iTotalMeaningful, iTotalMissings, iTotalFalsePositives ,
      {'v': null, 'f': '--' }],
      ['Average', null, Number((fTotalTime / iLen).toFixed(2)),
        null,
        Number((iTotalExpected / iLen).toFixed(2)),
        Number((iTotalMeaningful / iLen).toFixed(2)),
        Number((iTotalMissings / iLen).toFixed(2)),
        Number((iTotalFalsePositives / iLen).toFixed(2)),
        Number((iTotalError / iLen).toFixed(2))]
    ]);

  var table = new google.visualization.Table(document.getElementById('table_div'));
  table.draw(oData, {showRowNumber: true});
}

window.addEventListener('results', function(e) {
  mDrawTable(e.detail);
})