'use strict';

module('Cotton.UI.Stand.Story.Card.Factory', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://www.youtube.com/watch?v=g0lbfEb8MMk",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oFactory = new Cotton.UI.Stand.Story.Card.Factory();
  ok(oFactory);
});

test('create a default card.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oFactory = new Cotton.UI.Stand.Story.Card.Factory();
  var oCard = oFactory.get(oHistoryItem, oDispatcher);
  ok(oCard);
  ok(oCard._sType, "default");
});

test('create an image card.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://upload.wikimedia.org/wikipedia/commons/6/6d/Alice_in_wonderland_1951.jpg",
    'sTitle' : "Alice_in_wonderland_1951.jpg",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oFactory = new Cotton.UI.Stand.Story.Card.Factory();
  var oCard = oFactory.get(oHistoryItem, oDispatcher);
  ok(oCard);
  ok(oCard._sType, "image");
});

test('create a map card.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "https://maps.google.fr/maps?q=Escuela+Militar,+Las+Condes,+Chile&ie=UTF-8&hq=&hnear=0x9662cf187c27c041:0x7c34b04d3eb6805f,Escuela+Militar&gl=fr&ei=RsFIUc3MOOu00AGJ0YDQBA&ved=0CI0BELYD",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oFactory = new Cotton.UI.Stand.Story.Card.Factory();
  var oCard = oFactory.get(oHistoryItem, oDispatcher);
  ok(oCard);
  ok(oCard._sType, "map");
});

test('create a video card', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://www.youtube.com/watch?v=g0lbfEb8MMk",
    'sTitle' : "Alice In Wonderland - All In The Golden Afternoon - Youtube",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oFactory = new Cotton.UI.Stand.Story.Card.Factory();
  var oCard = oFactory.get(oHistoryItem, oDispatcher);
  ok(oCard);
  ok(oCard._sType, "video");
});

