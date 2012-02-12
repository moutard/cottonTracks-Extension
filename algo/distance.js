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
  // Return the number of common words
  
  var iTitleWordsAmount = 0;
  var lWords1 = extractWords(oHistoryItem1.title);
  var lWords2 = extractWords(oHistoryItem2.title);
  
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
	// compute the Id distance
	return Math.abs(parseInt(oHistoryItem1.id) - parseInt(oHistoryItem2.id));
};

function distanceLastVisitTime(oHistoryItem1, oHistoryItem2){
  // compute the last visit distance
  return  Math.abs(oHistoryItem1.lastVisitTime - oHistoryItem2.lastVisitTime);
};

// TODO(rmoutard) : Write a better distance, maybe to keep it between [0,1]
// for instance you need to balance common words
function distanceComplexe(oHistoryItem1, oHistoryItem2){
	
	//TODO: (rmoutard) write a class for coefficients
	var coeff = {};
	coeff['id']=0.2;
	coeff['lastVisitTime']=0.4;
	coeff['commonWords']=0.4;
	
	
	// id
	// id close => items close
	// ordre de grandeur = O(1000)
	var sum = coeff['id']*Math.abs(parseInt(oHistoryItem1.id) - parseInt(oHistoryItem2.id));
	
	// lastTimeVisit
	// lastTimeVisit close => items close
	// ordre de grandeur = O(100 000)
	sum += coeff['lastVisitTime']*Math.abs(oHistoryItem1.lastVisitTime - oHistoryItem2.lastVisitTime);
	
	// Common words
	// number of common words is high => items close
	// ordre de grandeur = O(5)
	sum += coeff['commonWords']*commonWords(oHistoryItem1, oHistoryItem1)*1000;
	
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

