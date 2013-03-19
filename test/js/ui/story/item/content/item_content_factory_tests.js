'use strict';

module('Cotton.UI.Item.Content.Factory', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://www.youtube.com/watch?v=g0lbfEb8MMk",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = Cotton.UI.Story.Item.Content.Factory(oHistoryItem);
  ok(oContent);
});

test('create a content default.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = Cotton.UI.Story.Item.Content.Factory(oHistoryItem);
  ok(oContent);
  ok(oContent._$content.hasClass('ct-content_default'));
});

test('create a content image.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg",
    'sTitle' : "Alice_in_wonderland_1951.jpg",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = Cotton.UI.Story.Item.Content.Factory(oHistoryItem);
  ok(oContent);
  ok(oContent._$img);
});

test('create a content map.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "https://maps.google.fr/maps?q=Escuela+Militar,+Las+Condes,+Chile&ie=UTF-8&hq=&hnear=0x9662cf187c27c041:0x7c34b04d3eb6805f,Escuela+Militar&gl=fr&ei=RsFIUc3MOOu00AGJ0YDQBA&ved=0CI0BELYD",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = Cotton.UI.Story.Item.Content.Factory(oHistoryItem);
  ok(oContent);
  ok(oContent._$map);
});

test('create a content search.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "https://www.google.fr/search?q=alice+in+wonderland&aq=f&oq=alice+in+wonderland&aqs=chrome.0.59j60j0l3j62.3401&sourceid=chrome&ie=UTF-8",
    'sTitle' : "alice in wonderland - Recherche Google",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = Cotton.UI.Story.Item.Content.Factory(oHistoryItem);
  ok(oContent);
  ok(oContent._$title);
});

test('create a content video', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://www.youtube.com/watch?v=g0lbfEb8MMk",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = Cotton.UI.Story.Item.Content.Factory(oHistoryItem);
  ok(oContent);
  ok(oContent._sVideoType);
});

