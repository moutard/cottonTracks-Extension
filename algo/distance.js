
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