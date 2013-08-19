module("Cotton.Algo.Common.WordsExtractor", {});

test('tech star seattle with ":" in title', function(){
  var a = new Cotton.Model.HistoryItem({
    'sTitle': "TechStars Seattle: The Early Word on the Lucky Few | Xconomy",
    'sUrl': "http://www.xconomy.com/seattle/2012/08/10/techstars-seattle-2012/",
  });
  Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(a);
  deepEqual(a.extractedDNA().bagOfWords().get(),
    {
      'techstars':3,
      'seattle':3,
      'early':3,
      'word': 3,
      'lucky': 3,
      'few':3,
      'xconomy':3
    });
});

test('strong and weak keywords - weak left over', function(){
  var a = new Cotton.Model.HistoryItem({
    'sTitle': "apply for the best incubator - Recherche Google",
    'sUrl': "https://www.google.com/search?q=apply+for+the+best+incubator",
  });
  Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(a);
  deepEqual(a.extractedDNA().bagOfWords().get(),
    {
      'apply': 5,
      'best': 5,
      'incubator':5
    });
});

test('strong and weak keywords - weak kept', function(){
  var a = new Cotton.Model.HistoryItem({
    'sTitle': "the Doors - Recherche Google",
    'sUrl': "https://www.google.com/search?q=the+Doors",
  });
  Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(a);
  deepEqual(a.extractedDNA().bagOfWords().get(),
    {
      'doors': 5,
      'the': 2
    });
});

test('tech star seattle', function(){
  var a = new Cotton.Model.HistoryItem({
    'sTitle': "Crash Dev: Apply now for TechStars Seattle 2013",
    'sUrl': "http://www.crashdev.com/2013/03/apply-now-for-techstars-seattle-2013.html",
  });
  Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(a);
  deepEqual(a.extractedDNA().bagOfWords().get(),
    {
      'crash':3,
      'dev':3,
      'apply':3,
      'now': 3,
      'techstars':3,
      'seattle':3
    });
});
