Cotton.Algo.Common.Words.isInBlackList = function(sWord) {
var blackList = ['htm', 'the', 'pdf',
"and", "also", "or", "no", "so", "for", "else", "but", "yet", "still", "anyway",
"both", "not", "also", "only", "too", "either", "neither", "rather", "than",
"more", "less", "whether", "neither", "besides", "because", "since", "rather",
"though", "unless", "even", "although", "while", "whereas", "despite", "spite",
"regardless", "where", "wherever", "until", "the", "once",
"furthermore", "moreover", "additionally", "besides", "firstly", "secondly",
"finally", "instead", "otherwise", "thus", "hence", "accordingly", "anyhow",
"nevertheless", "nonetheless", "however", "meanwhile", "subsequently", "afterward",
"are", "com", "fr", "with", "you", "in", "what", "to", "do", "an", "a", "jpg", "gif", "jpeg", "png", "les"
];

  return blackList.indexOf(sWord) !== -1;
};

Cotton.Algo.Common.Words.removeFromTitle = function(sTitle) {
var blackList = ["| LinkedIn", "- Wikipedia, the free encyclopedia", "- Wikipédia",
"- YouTube", "on Vimeo", "- Stack Overflow", "| TechCrunch", "- The Verge"
];
  var sCleanTitle = sTitle;
  for (var i = 0, sExpression; sExpression = blackList[i]; i++){
    sCleanTitle = sCleanTitle.replace(sExpression,"");
  }
  return sCleanTitle;
};