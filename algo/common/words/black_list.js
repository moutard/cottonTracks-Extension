Cotton.Algo.Common.Words.isInBlackList = function(sWord) {
  var blackList = ['htm', 'html', 'and', 'the', 'pdf'];

  return blackList.indexOf(sWord) !== -1;
};
