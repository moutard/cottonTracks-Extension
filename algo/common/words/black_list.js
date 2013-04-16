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
"are", "com", "fr", "with", "you", "in", "what", "to", "do", "an", "a", "wikipedia",
"free", "encyclopedia", "wikipédia"
];

  return blackList.indexOf(sWord) !== -1;
};
