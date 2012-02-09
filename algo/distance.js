// Tools 

function extractWords(sTitle) {
  // We cannot use the \b boundary symbol in the regex because accented characters would not be considered (not art of \w).
  // Include all normal characters, dash, accented characters.
  // TODO(fwouts): Consider other characters such as digits?
  var oRegexp = /[\w\-\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/g;
  var lMatches = sTitle.match(oRegexp) || [];
  // TODO(fwouts): Be nicer on the words we keep, but still reject useless words such as "-".
  lMatches = $.grep(lMatches, function(sWord) {
    return sWord.length > 2;
  });
  return lMatches;
};

function commonWords(oHistoryItem1, oHistoryItem2) {

  var iTitleWordsAmount = 0;
  var lWords1 = extractWords(oVisitItem1.title);
  var lWords2 = extractWords(oVisitItem2.title);
  
  var dWords1 = {};
  for (var iI = 0, iN = lWords1.length; iI < iN; iI++) {
    var sWord = lWords1[iI];
    dWords1[sWord] = true;
  }
  for (var iI = 0, iN = lWords2.length; iI < iN; iI++) {
    var sWord = lWords2[iI];
    if (dWords1[sWord]) {
      // The word is resent in both.
      iTitleWordsAmount++;
      // Do not count it twice.
      delete dWords1[sWord];
    }
  }

  return iTitleWordsAmount;
};

function distance( oHistoryItem1, oHistoryItem2) {
	// compute distance between two historyItems
	
};

function distanceId(oHistoryItem1, oHistoryItem2) {
	//
	return Math.abs(oHistoryItem1.id - oHistoryItem2.id);
};

function distanceComplexe(oHistoryItem1, oHistoryItem2){
	
	//TODO: (rmoutard) write a class for coefficients
	var coeff = {};
	coeff[id]=0.4;
	coeff[lastVisitTime]=0.4;
	coeff[commonWords]=0.2;
	
	console.log(oHistoryItem1.id)
	// id
	// id close => items close
	var sum = coeff[id]*Math.abs(parseInt(oHistoryItem1.id) - parseInt(oHistoryItem2.id));
	
	// lastTimeVisit
	// lastTimeVisit close => items close
	sum += coeff[lastVisitTime]*Math.abs(oHistoryItem1.lastTimeVisit - oHistoryItem2.lastTimeVisit);
	
	// Common words
	// number of common words is higth => items close
	//sum += coeff[commonWords]*commonWords(oHistoryItem1, oHistoryItem1);
	
	return sum; 
};

/*
HistoryItem
	An object encapsulating one result of a history query.
	
	id ( string )
		The unique identifier for the item.
	url ( optional string )
		The URL navigated to by a user.
	title ( optional string )
		The title of the page when it was last loaded.
	lastVisitTime ( optional number )
		When this page was last loaded, represented in milliseconds since the epoch.
	visitCount ( optional integer )
		The number of times the user has navigated to this page.
	typedCount ( optional integer )
		The number of times the user has navigated to this page by typing in the address.
*/

