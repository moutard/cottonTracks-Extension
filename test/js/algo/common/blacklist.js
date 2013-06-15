module("Cotton.Algo.Common.GenerateBlacklistExpressions", {});

test('Titles with "-".', function(){
  var lHistoryItems = [
    {
      'title': "Test - Wikipedia, the free encyclopedia",
      'url': "http://en.wikipedia.org/wiki/test",
      'visitCount': 100
    },
    {
      'title': "Test - Wikipédia, l'encyclopédie libre",
      'url': "http://fr.wikipedia.org/wiki/test",
      'visitCount': 100
    },
    {
      'title': "- Hommage à Jacques Tati (Bataclan 2009)",
      'url': "http://www.youtube.com/fr/watch?v=EzV8rd2",
      'visitCount': 100
    },
    {
      'title': "compare words in two strings - Recherche Google",
      'url': 'https://www.google.com/search?q=compare+words+in+two+strings',
      'visitCount': 100
    },
    {
      'title': "Chrome Web Store - cottonTracks",
      'url': 'https://chrome.google.com/webstore/detail/flmfagndkngjknjjcoejaihmibcfcjdh',
      'visitCount': 100
    },
    {
      'title': "The End - The Doors - YouTube",
      'url': 'http://www.youtube.com/watch?v=ZUb4eh0AIhU&list=RD02OHQtbalbYMc',
      'visitCount': 100
    },

  ];

  var lBlacklist = Cotton.Algo.Common.Words.generateBlacklistExpressions(lHistoryItems);
  deepEqual(lBlacklist, [".jpg", ".jpeg", ".png", ".gif", ".pdf", "- Wikipedia, the free encyclopedia", "- Wikipédia, l'encyclopédie libre", "- Recherche Google", "Chrome Web Store -", "- YouTube"] );
});