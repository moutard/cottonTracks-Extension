'use strict'

Cotton.Algo.Common.Words.isInBlackList = function(sWord) {
  // The blackList is pre-sorted to make a binary search.
  var lBlackList = ["a", "accordingly", "additionally", "afterward", "also", "also", "although", "an", "and", "anyhow", "anyway", "are", "because", "besides", "besides", "both", "but", "com", "despite", "do", "either", "else", "even", "finally", "firstly", "for", "fr", "furthermore", "hence", "however", "htm", "in", "instead", "les", "less", "meanwhile", "more", "moreover", "neither", "neither", "nevertheless", "no", "nonetheless", "not", "once", "only", "or", "otherwise", "rather", "rather", "regardless", "secondly", "since", "so", "spite", "still", "subsequently", "than", "the", "the", "though", "thus", "to", "too", "unless", "until", "what", "where", "whereas", "wherever", "whether", "while", "with", "yet", "you"]
  // Using underscore indexOf, pass the last parameter as true, to make
  // binary search.
  return _.indexOf(lBlackList, sWord, true) !== -1;
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

Cotton.Algo.Common.Words.generateBlacklistExpressions = function(lHistoryItems) {
  var lBlacklistExpressions = [".jpg", ".jpeg", ".png", ".gif", ".pdf"];

  // Store the frequency of each expression.
  var dExpressions = {};

  // For each historyItems, using this title, find the expressions starting or ending with " - " or " | ".
  for (var i = 0, oHistoryItem; oHistoryItem = lHistoryItems[i]; i++) {
    var oUrl = new UrlParser(oHistoryItem.url());
    var sHostname = oUrl.hostname.toLowerCase();
    var lExpressions = [];

    var lDash = oHistoryItem.title().split(' - ');
    for (var j = 0, sDash, jLength = lDash.length; sDash = lDash[j]; j++) {
      if (jLength > 1 && j > 0){
        lExpressions.push("- " + sDash);
      }
      if (jLength > 1 && j < jLength - 1){
        lExpressions.push(sDash + " -");
      }
    }
    var lBar = oHistoryItem.title().split(' | ');
    for (var j = 0, sBar, jLength = lBar.length; sBar = lBar[j]; j++) {
      if (jLength > 1 && j > 0){
        lExpressions.push("| " + sBar);
      }
      if (jLength > 1 && j < jLength - 1){
        lExpressions.push(sBar + " |");
      }
    }

    for (var j = 0, sExpression; sExpression = lExpressions[j]; j++) {
      // clear the accents to be able to compare the title with the hostname
      var sAccentTidy = Cotton.Algo.Common.Words.AccentTidy(sExpression);
      var lAccentTidyWords = Cotton.Algo.Tools.extractWordsFromTitle(sAccentTidy);
      for (var k = 0, sWord; sWord = lAccentTidyWords[k]; k++) {
        // check if one of the words in the pattern is also in the hostname
        // to decide if we put the pattern in the blacklist candidates
        if (sHostname.indexOf(sWord) !== -1 ) {
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

  var threshold = lHistoryItems.length * Cotton.Config.Parameters.iMinRecurringPattern / 100;
  for (var sExpression in dExpressions) {
    // we check all the blacklist candidates and see if the appear
    // more frequently than a threshold
    if (dExpressions[sExpression] >= threshold) {
        lBlacklistExpressions.push(sExpression);
    }
  }
  DEBUG && console.debug(lBlacklistExpressions);
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
