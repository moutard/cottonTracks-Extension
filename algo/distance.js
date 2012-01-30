
function Distance(historyItem1, historyItem2) {
	// Class Distance
	
    this.attribut1 = parametre1; 
    this.attribut2 = parametre2; 
     
    this.methode = function() { 
        alert("Attributs: " + this.attribut1 + ", " + this.attribut2); 
    };
}

function distanceId(historyItem1, historyItem2) {
	//
	return Math.abs(historyItem1.id - historyItem2.id);
}

function distanceComplexe(historyItem1, historyItem2){
	
	//TODO: (rmoutard) write a class for coefficients
	var coeff = {};
	coeff[id]=0.5;
	coeff[lastVisitTime]=0.5;
	
	var sum = coeff[id]*Math.abs(historyItem1.id - historyItem2.id);
	sum += coeff[lastVisitTime]*Math.abs(historyItem1.lastTimeVisit - historyItem2.lastTimeVisit);
	
	return sum; 
}

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

function distance(oVisitItem1, oVisitItem2) {
  
  var iUrlAmount = +(oVisitItem1.historyItem.url == oVisitItem2.historyItem.url);
  
  var iSubDomainAmount = +(extractSubDomain(oVisitItem1.historyItem) == extractSubDomain(oVisitItem2.historyItem));
  
  var iReferringAmount = (oVisitItem1.referringVisitId == oVisitItem2.visitId) + (oVisitItem2.referringVisitId == oVisitItem1.visitId);
  
  var iTitleWordsAmount = 0;
  var lWords1 = extractWords(oVisitItem1.historyItem.title);
  var lWords2 = extractWords(oVisitItem2.historyItem.title);
  // Check how many words they have in common.
  // TODO(fwouts): Write a faster algorithm.
  // TODO(fwouts): Consider using this to check if there are common parts in the URLs.
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
  // We say that there has to be a minimum of 2 common words.
  iTitleWordsAmount -= 1;
  
  // The higher the url amount, the closest.
  // The higher the subdomain amount, the closest.
  // The higher the referring amount, the closest.
  // The higher the words amount, the closest.
  // TODO(fwouts): Consider the time difference between the opening time of tabs (multiply it by other factors?).
  return -5. * iUrlAmount - 10. * iSubDomainAmount - 1. * iReferringAmount - 1. * (iTitleWordsAmount - 3);
}

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
}
