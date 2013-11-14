module("Cotton.Algo.Common.GenerateBlacklistExpressions", {});

test('Titles with "-".', function(){
  var oHistoryItem1 = new Cotton.Model.HistoryItem({
      'sTitle': "Test - Wikipedia, the free encyclopedia",
      'sUrl': "http://en.wikipedia.org/wiki/test",
      'iVisitCount': 100
    });
  var oHistoryItem2 = new Cotton.Model.HistoryItem({
      'sTitle': "Test - Wikipédia, l'encyclopédie libre",
      'sUrl': "http://fr.wikipedia.org/wiki/test",
      'iVisitCount': 100
    });
  var oHistoryItem3 = new Cotton.Model.HistoryItem({
      'sTitle': "- Hommage à Jacques Tati (Bataclan 2009)",
      'sUrl': "http://www.youtube.com/fr/watch?v=EzV8rd2",
      'iVisitCount': 100
    });
  var oHistoryItem4 = new Cotton.Model.HistoryItem({
      'sTitle': "compare words in two strings - Recherche Google",
      'sUrl': 'https://www.google.com/search?q=compare+words+in+two+strings',
      'iVisitCount': 100
    });
  var oHistoryItem5 = new Cotton.Model.HistoryItem({
      'sTitle': "Chrome Web Store - cottonTracks",
      'sUrl': 'https://chrome.google.com/webstore/detail/flmfagndkngjknjjcoejaihmibcfcjdh',
      'iVisitCount': 100
    });
  var oHistoryItem6 = new Cotton.Model.HistoryItem({
      'sTitle': "The End - The Doors - YouTube",
      'sUrl': 'http://www.youtube.com/watch?v=ZUb4eh0AIhU&list=RD02OHQtbalbYMc',
      'iVisitCount': 100
    });

  var lHistoryItems = [oHistoryItem1 ,oHistoryItem2 ,oHistoryItem3 ,oHistoryItem4 ,oHistoryItem5 ,oHistoryItem6];

  var lBlacklist = Cotton.Algo.Common.Words.generateBlacklistExpressions(lHistoryItems);
  deepEqual(lBlacklist, [".jpg", ".jpeg", ".png", ".gif", ".pdf", "- Wikipedia, the free encyclopedia", "- Wikipédia, l'encyclopédie libre", "- Recherche Google", "Chrome Web Store -", "- YouTube"] );
});

test('Titles with "-".', function(){
  // var lTranslators = Cotton.Translators.HISTORY_ITEM_TRANSLATORS;
  // var oTranslator = lTranslators[lTranslators.length - 1];

  var iLength = _history_items.length;
  var lHistoryItems = [];

  var oTranslator = Cotton.Translators.HISTORY_ITEM_TRANSLATORS[0];

  for (var i = 0; i < iLength; i++){
    var dHistoryItem = _history_items[i];
    var oHistoryItem = oTranslator.chromeHistoryItemToObject(dHistoryItem);
    lHistoryItems.push(oHistoryItem);
  }
  var lBlacklist = Cotton.Algo.Common.Words.generateBlacklistExpressions(lHistoryItems);
  deepEqual(lBlacklist.sort(),
  [
    "- ARTE",
    "- AlloCiné",
    "- Avignon Festival & Compagnies",
    "- Culturebox",
    "- Dictionnaire Français-Anglais WordReference.com",
    "- Dragon City Wiki",
    "- English-French Dictionary WordReference.com",
    "- Festival OFF 2013",
    "- Flyingblue",
    "- France Télévisions",
    "- Google Drive",
    "- Grooveshark",
    "- Job | LinkedIn",
    "- OVH",
    "- Recherche Google",
    "- Stack Overflow",
    "- Wikipedia, the free encyclopedia",
    "- Wikipédia",
    "- cottonTracks Mail",
    ".gif",
    ".jpeg",
    ".jpg",
    ".pdf",
    ".png",
    "ARTE Journal |",
    "Cover letter Google.docx -",
    "Culturebox -",
    "Festival OFF 2013 -",
    "Grooveshark -",
    "LTU Cloud |",
    "Mr Miles -",
    "Shape the World -",
    "TVsubtitles.net -",
    "| ARTE Journal",
    "- videos.arte.tv",
    "| Culturebox",
    "| En streaming sur francetv pluzz",
    "| LinkedIn",
    "| fr - ARTE"
  ].sort());
});
