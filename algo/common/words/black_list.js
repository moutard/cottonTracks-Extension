'use strict'

Cotton.Algo.Common.Words.isInBlackList = function(sWord) {
var blackList = ['htm', 'the',
"and", "also", "or", "no", "so", "for", "else", "but", "yet", "still", "anyway",
"both", "not", "also", "only", "too", "either", "neither", "rather", "than",
"more", "less", "whether", "neither", "besides", "because", "since", "rather",
"though", "unless", "even", "although", "while", "whereas", "despite", "spite",
"regardless", "where", "wherever", "until", "the", "once",
"furthermore", "moreover", "additionally", "besides", "firstly", "secondly",
"finally", "instead", "otherwise", "thus", "hence", "accordingly", "anyhow",
"nevertheless", "nonetheless", "however", "meanwhile", "subsequently", "afterward",
"are", "com", "fr", "with", "you", "in", "what", "to", "do", "an", "a", "les"
];

  return blackList.indexOf(sWord) !== -1;
};

Cotton.Algo.Common.Words.removeFromTitle = function(sTitle) {
var blackList = ["| LinkedIn", "- Wikipedia, the free encyclopedia", "- Wikipédia",
"- Wikimedia Commons", "- YouTube", "on Vimeo", "- Stack Overflow",
"| TechCrunch", "| The Verge", "| Abduzeedo Design Inspiration & Tutorials", "| VentureBeat",
"| Geeklets", "– SoftFacade", "Daily Design Inspiration -", "| Daily design inspiration",
"Dribbble -", "| Tumblr", "| Flickr - Photo Sharing!", "Megapont -", "sur CINEMUR.FR",
"- AlloCiné", "| From up North", "| Co.Design: business + innovation + design", "– Fubiz™",
"- HTML / CSS - Creattica", "The Pirate Bay - The galaxy's most resilient bittorrent site",
"- L'Equipe.fr", "| Wired.com", "| Wired", "| Fast Company", "(download torrent) - TPB",
"- Venture Hacks", "| Complex", "- IMDb", "Venture Hacks -", "- Springer", "- Google Scholar",
"| Rap Genius",
".jpg", ".jpeg", ".png", ".gif", ".pdf"
];
  var sCleanTitle = "" + sTitle;
  for (var i = 0,
    sExpression; sExpression = Cotton.Algo.Common.Words.BlacklistExpressions[i]; i++){
      sCleanTitle = sCleanTitle.replace(sExpression,"");
  }
  return sCleanTitle;
};

Cotton.Algo.Common.Words.BlacklistExpressions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];

Cotton.Algo.Common.Words.setBlacklistExpressions = function(lExpressions) {
  Cotton.Algo.Common.Words.BlacklistExpressions = lExpressions;
};

Cotton.Algo.Common.Words.generateBlacklistExpressions = function(lChromeHistoryItems) {
  var oRegexp = /\-\ [^\-\|]+|\|\ [^\-\|]+/g;
  var dExpressions = {};
  for (var i = 0, dChromeHistoryItem; dChromeHistoryItem = lChromeHistoryItems[i]; i++){
    if(dChromeHistoryItem['title'].match(oRegexp)){
      // console.log(dChromeHistoryItem['title'].match(oRegexp));
      var lExpressions = dChromeHistoryItem['title'].match(oRegexp);
      for (var j = 0, sExpression; sExpression = lExpressions[j]; j++){
        if (dExpressions[sExpression]){
          dExpressions[sExpression] += dChromeHistoryItem['visitCount'];
        } else {
          dExpressions[sExpression] = dChromeHistoryItem['visitCount'];
        }
      }
    }
  }
  var threshold = lChromeHistoryItems.length * Cotton.Config.Parameters.iMinRecurringPattern / 100;
  for (var sExpression in dExpressions){
    if (dExpressions[sExpression] >= threshold){
        Cotton.Algo.Common.Words.BlacklistExpressions.push(sExpression);
    }
  }
  DEBUG && console.debug(Cotton.Algo.Common.Words.BlacklistExpressions);
  localStorage.setItem(
    'blacklist-expressions',JSON.stringify(Cotton.Algo.Common.Words.BlacklistExpressions));
};