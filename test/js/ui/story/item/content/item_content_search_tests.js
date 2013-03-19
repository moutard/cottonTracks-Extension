'use strict';

module('Cotton.UI.Item.Content.Search', {

});

test('init.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "https://www.google.fr/search?q=alice+in+wonderland&aq=f&oq=alice+in+wonderland&aqs=chrome.0.59j60j0l3j62.3401&sourceid=chrome&ie=UTF-8",
    'sTitle' : "alice in wonderland - Recherche Google",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = new Cotton.UI.Story.Item.Content.Search(oHistoryItem);
  ok(oContent);
});

test('title is well setted.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "https://www.google.fr/search?q=alice+in+wonderland&aq=f&oq=alice+in+wonderland&aqs=chrome.0.59j60j0l3j62.3401&sourceid=chrome&ie=UTF-8",
    'sTitle' : "alice in wonderland - Recherche Google",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = new Cotton.UI.Story.Item.Content.Search(oHistoryItem);
  equal(oContent._$title.text(), "alice in wonderland");
  equal(oContent._$searchInput.val(), "alice in wonderland");
});

test('title is well setted for empty.', function() {
  var oHistoryItem = new Cotton.Model.HistoryItem({
    'sUrl': "https://www.google.fr/search?q=alice+in+wonderland&aq=f&oq=alice+in+wonderland&aqs=chrome.0.59j60j0l3j62.3401&sourceid=chrome&ie=UTF-8",
    'sTitle' : "",
    'iLastVisitTime' : 1363648480386,
    'oExtractedDNA' : {}
  });

  var oContent = new Cotton.UI.Story.Item.Content.Search(oHistoryItem);
  equal(oContent._$title.text(), "Search");
});
