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
  if (sTitle) {
    var sCleanTitle = sTitle;
    var lBlacklistExpressions = JSON.parse(localStorage.getItem('blacklist-expressions'))||[];
    for (var i = 0, sExpression;
      sExpression = lBlacklistExpressions[i]; i++){
      sCleanTitle = sCleanTitle.replace(sExpression, "");
    }
  } else {
    //handle the undefined case
    var sCleanTitle = "";
  }
  return sCleanTitle;
};

//FIXME(rmoutard->rkorach): add comments, and maybe you need a specific function
// that cuts in the title.
Cotton.Algo.Common.Words.generateBlacklistExpressions = function(lHistoryItems) {
  var lBlacklistExpressions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];

  // oEndRexexp is made to find all end patterns in title looking like
  // "some random text here - pattern_after_space_plus_dash", or
  // "some random text here | pattern_after_space_plus_vertical_bar"
  var oEndRegexp = /\-\ [^\-\|]+|\|\ [^\-\|]+/g;
  // same for oStartRegexp but with the recurring pattern before the dash or vertical bar
  var oStartRegexp = /[^\-\|]+\ \-|[^\-\|]+\ \|/g;

  // Store the frequency of each expression.
  var dExpressions = {};

  // For each historyItems, using this title, compute it's end and start pattern.
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
    var lEndPattern = oHistoryItem.title().match(oEndRegexp);
    var lStartPattern = oHistoryItem.title().match(oStartRegexp);
    if (lEndPattern || lStartPattern) {
      lEndPattern = lEndPattern || [];
      lStartPattern = lStartPattern || [];
      var lExpressions = lEndPattern.concat(lStartPattern);
      var oUrl = new UrlParser(oHistoryItem.url());
      oUrl.hostname.toLowerCase();
      for (var j = 0, sExpression; sExpression = lExpressions[j]; j++) {
        // clear the accents to be able to compare the title with the hostname
        var sAccentTidy = Cotton.Algo.Common.Words.AccentTidy(sExpression);
        var lAccentTidyWords = Cotton.Algo.Tools.extractWordsFromTitle(sAccentTidy);
        for (var k = 0, sWord; sWord = lAccentTidyWords[k]; k++) {
          // check if one of the words in the pattern is also in the hostname
          // to decide if we put the pattern in the blacklist candidates
          if (oUrl.hostname.indexOf(sWord) !== -1 ) {
            // Set the frequency of the expression.
            if (dExpressions[sExpression]) {
              dExpressions[sExpression] += oHistoryItem.visitCount();
            } else {
              dExpressions[sExpression] = oHistoryItem.visitCount();
            }
            // break the 'for' loop on words
            // because only one word in common with the hostname is necessary to validate
            // the pattern as a blacklisted candidate.
            break;
          }
        }
      }
    }
  }
  var threshold = lHistoryItems.length * Cotton.Config.Parameters.iMinRecurringPattern / 100;
  for (var sExpression in dExpressions) {
    // we check all the blacklist candidates and see if the appear
    // more frequently than a threshold
    if (dExpressions[sExpression] >= threshold) {
        lBlacklistExpressions.push(sExpression);
    }
  }
  DEBUG && console.debug(lBlacklistExpressions);
  // FIXME(rmoutard): the local storage should be out the function.
  localStorage.setItem(
    'blacklist-expressions',JSON.stringify(lBlacklistExpressions));
  return(lBlacklistExpressions);
};


Cotton.Algo.Common.Words.AccentTidy = function(sWord){
  var sAccentTidy = sWord.toLowerCase();
  sAccentTidy = sAccentTidy.replace(new RegExp("[àáâãäå]", 'g'),"a");
  sAccentTidy = sAccentTidy.replace(new RegExp("æ", 'g'),"ae");
  sAccentTidy = sAccentTidy.replace(new RegExp("ç", 'g'),"c");
  sAccentTidy = sAccentTidy.replace(new RegExp("[èéêë]", 'g'),"e");
  sAccentTidy = sAccentTidy.replace(new RegExp("[ìíîï]", 'g'),"i");
  sAccentTidy = sAccentTidy.replace(new RegExp("ñ", 'g'),"n");
  sAccentTidy = sAccentTidy.replace(new RegExp("[òóôõöő]", 'g'),"o");
  sAccentTidy = sAccentTidy.replace(new RegExp("œ", 'g'),"oe");
  sAccentTidy = sAccentTidy.replace(new RegExp("[ùúûüű]", 'g'),"u");
  sAccentTidy = sAccentTidy.replace(new RegExp("[ýÿ]", 'g'),"y");
  return sAccentTidy;
};