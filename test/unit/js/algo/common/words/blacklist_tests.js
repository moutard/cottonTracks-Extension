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

test('Titles with "-".', function(){
  var lBlacklist = Cotton.Algo.Common.Words.generateBlacklistExpressions(_history_items);
  deepEqual(lBlacklist,
  [".jpg",".jpeg",".png",".gif",".pdf","| ARTE"
  ,"Shape the World -"
  ,"- Aldebaran Robotics "
  ," Aldebaran Robotics |"
  ,"- Recherche Google"
  ,"VOD ,Télécharger Sur un fil sur UniversCiné -"
  ,"::,FILMS DISTRIBUTION ::,Peter Brook -"
  ,"- ARTE Boutique"
  ,"- WordReference Forums"
  ,"- Vente"
  ,"| LinkedIn"
  ,"- WordReference.com"
  ,"- Les Trois Coups"
  ,"| Coup de théâtre"
  ,"| Culturebox"
  ,"- Shakespeare en devenir "
  ,"- Université de Poitiers"
  ," Shakespeare en devenir -"
  ,"- Wikipedia, the free encyclopedia"
  ,"| En streaming sur francetv pluzz"
  ,"| Vidéo en streaming sur francetv pluzz"
  ,"- Stack Overflow"
  ,"- Dragon City Wiki"
  ,"Cool Fire Dragon -"
  ,"Lava Dragon -"
  ,"- Culturebox "
  ,"- France Télévisions"
  ," Culturebox -"
  ,"- GameSpot.com"
  ,"- Dragon Island Wiki!"
  ,"Dragon Island Forum • View topic -"
  ,"- Mac OS X Hints"
  ,"Electric Dragon -"
  ,"- Wikipédia"
  ,"- Haypo"
  ,"Star Dragon -"
  ,"Firebird Dragon -"
  ,"Flaming Rock Dragon -"
  ,"Terra Dragon -"
  ,"Volcano Dragon -"
  ,"- CASPEVI.com"
  ,"| Qualys, Inc."
  ,"Chameleon Dragon -"
  ,"Armadillo Dragon -"
  ,"Blizzard Dragon -"
  ,"Storm Dragon -"
  ,"Icecube Dragon -"
  ,"Cloud Dragon -"
  ,"Penguin Dragon -"
  ,"Hot Metal Dragon -"
  ,"Gummy Dragon -"
  ,"Gold Dragon -"
  ,"Pearl Dragon -"
  ,"- Deauville avec Voyages"
  ,"- Flyingblue"
  ,"Mr Miles -"
  ,"- CNET"
  ,"ratp.fr -"
  ,"- Google Maps"
  ,"- videos.arte.tv"
  ,"ARTE Journal -"
  ,"| ARTE Journal "
  ,"- ARTE"
  ," ARTE Journal |"
  ,"ARTE Journal |"
  ,"Sculpteo |"
  ,"- AlloCiné"
  ,"TVsubtitles.net -"
  ,"- Avignon Festival & Compagnies"
  ,"- Site officiel du festival OFF d'Avignon"
  ,"Avignon Festival & Compagnies -"
  ,"- Super User"]);
});
