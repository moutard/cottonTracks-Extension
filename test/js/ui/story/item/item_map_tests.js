'use strict';

module('Cotton.UI.Item.Map', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "http://en.wikipedia.org/wiki/Alice's_Adventures_in_Wonderland",
    'sTitle' : "Alice's Adventures in Wonderland",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oDispatcher = new Cotton.Messaging.Dispatcher();

  var oUrl = new UrlParser("https://maps.google.fr/maps?q=Escuela+Militar,+Las+Condes,+Chile&ie=UTF-8&hq=&hnear=0x9662cf187c27c041:0x7c34b04d3eb6805f,Escuela+Militar&gl=fr&ei=RsFIUc3MOOu00AGJ0YDQBA&ved=0CI0BELYD");
  var oItem = new Cotton.UI.Story.Item.Map(oUrl.href, oHistoryItem, "*", oDispatcher);
  ok(oItem);
});
