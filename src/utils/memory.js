function purgeArray(lArray) {
  for (var i = 0, iLength = lArray.length; i < iLength; i++) {
    lArray[i] = null;
  }
  return [];
};
