'use strict'

Cotton.Algo.Common.Words.isInBlackList = function(sWord) {
  // TODO(rmoutard): pre sort black list and make a dicotomique search.
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
  // FIXME(rmoutard->rkorach) what's this ""+sTitle ?
  var sCleanTitle = "" + sTitle;
  for (var i = 0, sExpression;
      sExpression = Cotton.Algo.Common.Words.BlacklistExpressions[i]; i++){
      sCleanTitle = sCleanTitle.replace(sExpression, "");
  }
  return sCleanTitle;
};

// FIXME(rmoutard->rkorach): avoid to use a global variable for this.
Cotton.Algo.Common.Words.BlacklistExpressions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];

Cotton.Algo.Common.Words.setBlacklistExpressions = function(lExpressions) {
  Cotton.Algo.Common.Words.BlacklistExpressions = lExpressions;
};

//FIXME(rmoutard->rkorach): add comments, and maybe you need a specific function
// that cuts in the title.
Cotton.Algo.Common.Words.generateBlacklistExpressions = function(lHistoryItems) {

  // Why are extacly lEndPattern and lStartPattern ?
  var oEndRegexp = /\-\ [^\-\|]+|\|\ [^\-\|]+/g;
  var oStartRegexp = /[^\-\|]+\ \-|[^\-\|]+\ \|/g;

  var oSplitRegExp = /[\ \,\-\|\(\)\']/g;

  // Store the frequeny of each expression.
  var dExpressions = {};

  // For each historyItems, using this title, compute it's end and start pattern.
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
    var lEndPattern = oHistoryItem.title().match(oEndRegexp);
    var lStartPattern = oHistoryItem.title().match(oStartRegexp);
    if (lEndPattern || lStartPattern) {
      lEndPattern = lEndPattern || [];
      lStartPattern = lStartPattern || [];
      var lExpressions = lEndPattern.concat(lStartPattern);
      for (var j = 0, sExpression; sExpression = lExpressions[j]; j++) {

        // FIXME(rmoutard->rkorach): there is already a function that split words
        // from an url. Use that instead of rewritiing it.
        var oUrl = new UrlParser(oHistoryItem.url());
        //FIXME(rmoutard->rkorach): accentTydy prefer a path Cotton.Utils...
        var sAccentTidy = accentTidy(sExpression);
        //FIXME(rmoutard->rkorach): do not use filter.
        var lAccentTidyWords = sAccentTidy.split(oSplitRegExp)
        .filter(function(sWord, lArray) {
          // Why 3 ?
            return sWord.length > 3
        });
        for (var k = 0, sWord; sWord = lAccentTidyWords[k]; k++) {
          // What do this "if" exaclty ?
          if (oUrl.hostname.toLowerCase().indexOf(sWord) !== -1 ) {
            // Set the frequency of the expression.
            if (dExpressions[sExpression]) {
              dExpressions[sExpression] += oHistoryItem.visitCount();
            } else {
              dExpressions[sExpression] = oHistoryItem.visitCount();
            }
            // FIXME(rmoutard->rkorach): I think this break do nothing.
            break;
          }
        }
      }
    }
  }
  var threshold = lHistoryItems.length * Cotton.Config.Parameters.iMinRecurringPattern / 100;
  for (var sExpression in dExpressions) {
    if (dExpressions[sExpression] >= threshold) {
        Cotton.Algo.Common.Words.BlacklistExpressions.push(sExpression);
    }
  }
  DEBUG && console.debug(Cotton.Algo.Common.Words.BlacklistExpressions);
  // FIXME(rmoutard): the local storage should be out the function.
  localStorage.setItem(
    'blacklist-expressions',JSON.stringify(Cotton.Algo.Common.Words.BlacklistExpressions));
  return(Cotton.Algo.Common.Words.BlacklistExpressions)
};
