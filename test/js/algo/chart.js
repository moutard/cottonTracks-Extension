'use strict';
var colors = ['#62FF70', '#0579FF', '#E8409F', '#FF4234', "#FF8F0D"];
google.load('visualization', '1', {packages:['table', 'corechart']});
google.setOnLoadCallback(drawFootTable);

function drawFootTable() {
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_history_source_foot;
  var lHistoryItems = Cotton.Core.Populate.Suite(lSampleHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    for(var sWord in oHistoryItem.extractedDNA().bagOfWords().get()){
      dWordsRepartition[sWord] = (dWordsRepartition[sWord] + 1) || 1;
    }
  }

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Words');
  data.addColumn('number', 'Frequence');
  for(var sWord in dWordsRepartition){
     data.addRows([[sWord, dWordsRepartition[sWord]]]);
  }
  var table = new google.visualization.Table(document.getElementById('words_repartition_foot'));
  table.draw(data, {
    showRowNumber: false,
    width: '200px',
    title: 'foot words'});
}
google.setOnLoadCallback(drawGreenTable);

function drawGreenTable() {
  var dWordsRepartition = {};
  var lSampleHistoryItems = chrome_visit_source_green.slice();
  var lHistoryItems = Cotton.Core.Populate.Suite(lSampleHistoryItems);
  for(var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++){
    for(var sWord in oHistoryItem.extractedDNA().bagOfWords().get()){
      dWordsRepartition[sWord] = (dWordsRepartition[sWord] + 1) || 1;
    }
  }

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Words');
  data.addColumn('number', 'Frequence');
  for(var sWord in dWordsRepartition){
     data.addRows([[sWord, dWordsRepartition[sWord]]]);
  }
  var table = new google.visualization.Table(document.getElementById('words_repartition_green'));
  table.draw(data, {
    showRowNumber: false});
}

google.setOnLoadCallback(drawVisitChart);
function drawVisitChart() {
  var data = google.visualization.arrayToDataTable([
    ['State',               'Green', 'Blue',  'Pink', 'Red'],
    ['HistoryItem',            7106,  10000,   10000, 10000],
    ['After preremovetools',   3792,   7521,    4979,  6653],
    ['VisitItem',              5377,  17322,   13521, 11936],
  ]);

  var options = {
    'title': 'Chrome history repartition',
    'colors': colors
  };

  var chart = new google.visualization.LineChart(document.getElementById('chrome_visit_chart'));
  chart.draw(data, options);
}

/**
 * Roughly separate session.
 */
google.setOnLoadCallback(drawSessionChart);
function drawSessionChart() {
  var llData = [['Session Size', 'Green', 'Blue',  'Pink', 'Red', 'Other'],
  ['0-5',             0,  0,   0,    0, 0],
  ['5-10',            0,  0,   0,    0, 0],
  ['10-50',           0,  0,   0,    0, 0],
  ['50-100',          0,  0,   0,    0, 0],
  ['>100',            0,  0,   0,    0, 0]];

  var $small_sessions = $('#small_sessions');
  var lColors = [
    chrome_visit_source_green.slice(),
    chrome_visit_source_blue.slice(),
    chrome_visit_source_pink.slice(),
    chrome_visit_source_red.slice(),
    chrome_visit_source_no_preremove_green.slice(),
    ];
  for(var i = 0; i < lColors.length; i++){
    Cotton.Algo.roughlySeparateSession(lColors[i], function(lSession){
      if(lSession.length <= 5) {
        llData[1][i+1] +=1;
        $small_sessions.append(sessionToDOM(lSession, i))
      } else if(lSession.length <= 10) {
        llData[2][i+1] +=1;
      } else if(lSession.length <= 50) {
        llData[3][i+1] +=1;
      } else if(lSession.length <= 100) {
        llData[4][i+1] +=1;
      } else {
        llData[5][i+1] +=1;
      }
    });
  }

  function sessionToDOM(lSession, owner){
    var $small_session = $('<div class="small_session color' +owner+'"></div>');
    for(var i=0; i < lSession.length; i++){
     $small_session.append(historyItemToDOM(lSession[i]));
    }
    return $small_session;
  };
  function historyItemToDOM(dHistoryItem) {
    var $history_item = $('<div class="history_item"></div>');
    $history_item.text(JSON.stringify([dHistoryItem['title'], dHistoryItem['url'],]));
    return  $history_item;
  };
  var data = google.visualization.arrayToDataTable(llData);

  var options = {
    title: 'Rough session size',
    hAxis: {title: 'Size of sessions', titleTextStyle: {color: 'red'}},
    'colors': colors
  };

  var chart = new google.visualization.ColumnChart(document.getElementById('roughly_sessions_chart'));
  chart.draw(data, options);
};
