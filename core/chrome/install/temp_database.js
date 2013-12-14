'use strict';
Cotton.Core.TempDatabase = Class.extend({

  _lChromeHistoryItems: undefined,
  _lChromeVisitItems: undefined,
  _lCottonHistoryItems: undefined,

  _oDatabase: undefined,
  _oClient: undefined,

  init: function(oDatabase, oSpecificClient) {
    this._lChromeHistoryItems = [];
    this._lChromeVisitItems = [];
    this._lCottonHistoryItems = [];
    this._oDatabase = oDatabase;

    // Get the historyClient (depends on the browser)
    this._oClient = oSpecificClient || new Cotton.Core.History.Client();
    this._oDatabase = oDatabase;
  },

  /**
   * Start the populate process.
   * Differenciate from the initiation.
   */
  populate : function(mCallBackFunction) {
    var self = this;
    if (self._oClient) {
      var oBenchmark = new Benchmark("PopulateDB");
      // Get chrome historyItems.
      this._oClient.get({
        text : '', // get all
        startTime : 0, // no start time.
        "maxResults" : Cotton.Config.Parameters.dbscan3.iMaxResult,
      }, function(lChromeHistoryItems) {
        oBenchmark.step('Get all historyItems');

        var iInitialNumberOfChromeHistoryItems = lChromeHistoryItems.length;
        DEBUG && console.debug('Number of Chrome HistoryItems: ' + iInitialNumberOfChromeHistoryItems);

        // Remove exluded item before looking for visitItems.
        self._lChromeHistoryItems = self.removeExcludedItem(lChromeHistoryItems);
        DEBUG && console.debug(self._lChromeHistoryItems.length);

        // After this we are dealing with cotton model history item.
        self.translateListOfChromeHistoryItems();
        DEBUG && console.debug(self._lChromeHistoryItems.length + " " + self._lCottonHistoryItems.length);

        // Purge the lChrome not needed anymore.
        var iLength = self._lChromeHistoryItems.length;
        for (var i = 0; i < iLength; i++) {
          self._lChromeHistoryItems[i] = null;
        }
        self._lChromeHistoryItems = [];

        // Compute blacklisted expressions for titles
        localStorage.setItem('blacklist-expressions',JSON.stringify(
          Cotton.Algo.Common.Words.generateBlacklistExpressions(self._lCottonHistoryItems)
        ));
        self.computeBagOfWordsForHistoryItemsList();
        self.removeHistoryItemsWithoutBagOfWords();

        self._lCottonHistoryItems.sort(function(a, b) {
          return a.chromeId() - b.chromeId();
        });
        DEBUG && console.debug(self._lChromeHistoryItems.length + " " + self._lCottonHistoryItems.length);
        var iLength = self._lCottonHistoryItems.length;
        var iCount = 0;
        DEBUG && console.debug('Number of Chrome HistoryItems after remove items without bag of words: ' + iLength);

        oBenchmark.step('Compute all historyItems');
        if (iLength == 0) {
          // Stop installation if there is no elements in the history.
          mCallBackFunction(self._lCottonHistoryItems, []);
        }
        // For each chromeHistory remaining find all the corresponding visitItems.
        for (var i = 0; i < iLength; i++) {
          // Attribute an fixed id directly instead of putting in the database
          // and let the database attribute the id.
          // Seems there is a problem with the id 0.
          var oHistoryItem = self._lCottonHistoryItems[i];

          // Do we really need that if we put them in the database ?
          // FIXME !!
          oHistoryItem.initId(i+1);

          self._oClient.getVisits({
              'url': oHistoryItem.url()
            }, function(lVisitItems) {

              // To avoid critical error if the lVisitItems is undefined.
              var iPositionInTheArray = -1;
              if (lVisitItems.length > 0) {
                // This check could be useless, as if we have an historyItem
                // it should be a visitItem, but avoid problem if the API
                // of Chrome change.
                iPositionInTheArray = self._getHistoryItemPositionFromId(lVisitItems[0]['id']);

                if(iPositionInTheArray != -1) {
                  var jLength = lVisitItems.length;
                  for (var j = 0; j < jLength; j++) {
                    lVisitItems[j]['cottonHistoryItemId'] = iPositionInTheArray;
                  }
                  self._lChromeVisitItems = self._lChromeVisitItems.concat(lVisitItems);
                } else {
                  console.error('-1 shouldnt be here');
                }
              }
              iCount +=1;
              // Once we get all the visitItems we can compute googleClosestSearch
              // page.
              if (iCount === iLength) {
                self._lChromeVisitItems.sort(function(a, b) {
                  return b['visitTime'] - a['visitTime'];
                });
                DEBUG && console.debug('Number of Chrome VisitItems: ' + self._lChromeVisitItems.length);

                oBenchmark.step('Get all visitItems');
                self.computeClosestGoogleSearchPage();
                oBenchmark.end();
                mCallBackFunction(self._lCottonHistoryItems, self._lChromeVisitItems,
                  iInitialNumberOfChromeHistoryItems);
              }
          });
        }
      });
    }
  },

  /**
   * return the position in this._lCottonHistoryItems of the
   * historyItem that has the given chrome id.
   * We know that historyItems are sorted by there id. So we use a binary
   * search to find the right one. Moreover we suppose we always ask for
   * a good iChromeId to avoid to test with -1.
   */
  _getHistoryItemPositionFromId : function(sChromeId) {
    var array = this._lCottonHistoryItems;
    var value = parseInt(sChromeId);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      array[mid].chromeId() < value ? low = mid + 1 : high = mid;
    }
    return (array[low] && array[low].chromeId() === value) ? low : -1;
  },

  getHistoryItems : function() {
    return this._lCottonHistoryItems;
  },

  getChromeVisitItems : function() {
    return this._lChromeHistoryItems;
  },

 /**
  * Among all the chrome historyItem remove those who are tools or exludeded
  * like https.
  * This method depends on the browser because the history API is not always the
  * same:
  *  - 'url' parameters of the dictionnary in chrome.
  * @param {Array.<dict>} lChromeHistoryItems: list of serialized historyItems.
  *  (see chrome api for more informations)
  */
  removeExcludedItem : function(lChromeHistoryItems) {
    DEBUG && console.debug('New PreRemoveTools - Start');

    var oExcludeContainer = new Cotton.Utils.ExcludeContainer();
    var lResult = [];

    var iLength = lChromeHistoryItems.length;
    for (var i=0; i < iLength; i++) {
      var dChromeHistoryItem = lChromeHistoryItems[i];
      if(!oExcludeContainer.isExcluded(dChromeHistoryItem['url'])){
        lResult.push(dChromeHistoryItem);
      }
    }

    return lResult;
  },

  translateListOfChromeHistoryItems : function() {
    var iLength = this._lChromeHistoryItems.length;
    for (var i=0; i < iLength; i++) {
      var dChromeHistoryItem = this._lChromeHistoryItems[i];
      var oHistoryItem = new Cotton.Model.HistoryItem();

      //oHistoryItem.initId(i);
      oHistoryItem.initUrl(dChromeHistoryItem['url']);
      oHistoryItem.setTitle(dChromeHistoryItem['title']);
      oHistoryItem.setLastVisitTime(dChromeHistoryItem['lastVisitTime']);
      oHistoryItem.setVisitCount(dChromeHistoryItem['visitCount']);
      oHistoryItem.setChromeId(parseInt(dChromeHistoryItem['id']));
      // Use the array of lChromeHistoryItems to because we don't need those
      // elements anymore and then we save space.
      this._lCottonHistoryItems[i] = oHistoryItem;
    }
    // this._lCottonHistoryItems = this._lChromeHistoryItems;
  },

  /**
   * Translate an array of history items into an array of cotton history items.
   * @param {Array.<Dict>} list of chrome historyItem from the chrome API.
   * @return {Array.<Cotton.Model.HistoryItem>}
   */
  computeClosestGoogleSearchPage : function() {

    var iSliceTime = Cotton.Config.Parameters.iSliceTime;
    // After this time a page is considered as non-linked with a query search page

    var sNonFound = "http://www.google.fr/";
    var iLength = this._lChromeVisitItems.length;
    for ( var i = 0; i < iLength; i++) {
      // The historyItem where we want to find the closest google search page.
      var oCurrentVisitItem = this._lChromeVisitItems[i];
      var oCurrentHistoryItem = this._lCottonHistoryItems[oCurrentVisitItem['cottonHistoryItemId']];
      if (oCurrentHistoryItem.oUrl().keywords){
        // search page, no need do recompute bagOfWords
        oCurrentHistoryItem.extractedDNA().setClosestGoogleSearchPage(oCurrentHistoryItem.oUrl());
      } else {

        // We begin to search from it's position in the chrome history item.
        var iSearchIndex = i;
        var oTempVisitItem = this._lChromeVisitItems[iSearchIndex];
        var oTempHistoryItem = this._lCottonHistoryItems[oTempVisitItem['cottonHistoryItemId']];

        // value by default
        oCurrentHistoryItem.extractedDNA().setClosestGoogleSearchPage(sNonFound);

        while(oTempVisitItem &&
          Math.abs(oTempVisitItem['visitTime'] - oCurrentVisitItem['visitTime']) < iSliceTime
            ){

            oTempHistoryItem = this._lCottonHistoryItems[oTempVisitItem['cottonHistoryItemId']];
            if (oTempHistoryItem.oUrl().keywords &&
                _.intersection( Cotton.Algo.Tools.LooseFilter(oTempHistoryItem.oUrl().keywords),
                                oCurrentHistoryItem.extractedDNA().bagOfWords().getWords()).length > 0 ) {
              // We found a page that should be the google closest query page.
              oCurrentHistoryItem.extractedDNA().setClosestGoogleSearchPage(oTempHistoryItem.url());

              // This will change the bag of words.
              // FIXME(rmoutard): old setQueryWords.
              // FIXME(rmoutard): check the oCurrentHistoryItem is well setted.
              oCurrentHistoryItem.extractedDNA().setQueryWords(oTempHistoryItem.oUrl().keywords);

              // Use method to compute in one step strong and weak query words.
              var dQueryWords = Cotton.Algo.Tools.QueryWords(oTempHistoryItem.oUrl().keywords);
              oCurrentHistoryItem.extractedDNA().setStrongQueryWords(dQueryWords["strong"]);
              oCurrentHistoryItem.extractedDNA().setWeakQueryWords(dQueryWords["weak"]);
              oCurrentHistoryItem.extractedDNA().setMinWeightForWord();

              break;
            } else {
              // the temp page is not a good google search page.
              // try the next one.
              iSearchIndex += 1;
              oTempVisitItem = this._lChromeVisitItems[iSearchIndex];
            }
        }
      }
    }
  },

  /**
   * Compute bag of words for title. If it's a search page, then set queryWords
   * and only if there is no title and no query words use the url.
   * That limits the numbers of error because url parser is prone for error.
   * @param {Array.<Cotton.Model.HistoryItem>}
   */
  computeBagOfWordsForHistoryItemsList : function() {
    var iLength = this._lCottonHistoryItems.length;
    for ( var i = 0; i < iLength; i++) {
      var oHistoryItem = this._lCottonHistoryItems[i];
      // It's a search page use keywords to set query words.
      Cotton.Algo.Tools.computeBagOfWordsForHistoryItem(oHistoryItem);
    }
    //return lHistoryItems;
  },

  /**
   * Remove history items without bag of words.
   */
  removeHistoryItemsWithoutBagOfWords : function() {
    var lHistoryItemsWithBagOfWords = [];
    var iLength = this._lCottonHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      var oHistoryItem = this._lCottonHistoryItems[i];
      if (!_.isEmpty(oHistoryItem.extractedDNA().bagOfWords().get())) {
        lHistoryItemsWithBagOfWords.push(oHistoryItem);
      }
    }
    this._lCottonHistoryItems = lHistoryItemsWithBagOfWords;
  },

  suite : function() {

  },
  /**
   * For each array:
   * - set all references inside the array to null
   * - set the array to []
   * Call this method when you don't want to use the the temp_database
   * anymore to be sure that all the references are set to null to allow
   * garbage collector to remove properly elements from the heap.
   */
  purge : function() {

    // Purge the lChrome not needed anymore.
    var iLength = this._lChromeHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      this._lChromeHistoryItems[i] = null;
    }
    var iLength = this._lChromeVisitItems.length;
    for (var i = 0; i < iLength; i++) {
      this._lChromeVisitItems[i] = null;
    }
    var iLength = this._lCottonHistoryItems.length;
    for (var i = 0; i < iLength; i++) {
      this._lCottonHistoryItems[i] = null;
    }

    this._lChromeHistoryItems = [];
    this._lChromeVisitItems = [];
    this._lCottonHistoryItems = [];

  },

});
