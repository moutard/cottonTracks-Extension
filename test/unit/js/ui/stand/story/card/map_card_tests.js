'use strict';

module('Cotton.UI.Stand.Story.Card.Map', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "https://maps.google.fr/maps?q=Escuela+Militar,+Las+Condes,+Chile&ie=UTF-8&hq=&hnear=0x9662cf187c27c041:0x7c34b04d3eb6805f,Escuela+Militar&gl=fr&ei=RsFIUc3MOOu00AGJ0YDQBA&ved=0CI0BELYD",
    'sTitle' : "Escuela Militar, Las Condes - Google Maps",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oUrl = new UrlParser(oHistoryItem.url());
  oUrl.fineDecomposition();
  var oMapCard = new Cotton.UI.Stand.Story.Card.Map(oUrl.dSearch['q'], oHistoryItem, oDispatcher);
  ok(oMapCard);
});