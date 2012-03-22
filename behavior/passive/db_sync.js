'use strict';

var oCurrentHistoryItem = new Cotton.Model.HistoryItem();
oCurrentHistoryItem.getInfoFromPage();
console.log(oCurrentHistoryItem);


 var oStore = new Cotton.DB.Store('ct',
        { 'historyItems': Cotton.Translators.HISTORY_ITEM_TRANSLATORS },
        function() {
          console.log("store ready"); //curent
          oStore.putUnique('historyItems', HistoryItem, url ,function() {
            console.log("historyItem added");
          });
        }
      );

/*chrome.history.search(
    { 'text': '',
      'maxResults': 1
    }, function(historyItems) {
      // Should return the last entry, i.e. the current page.
      console.log("last entry");
      console.log(historyItems);
    }
);*/
// error search can only be executed in extension runtime.
