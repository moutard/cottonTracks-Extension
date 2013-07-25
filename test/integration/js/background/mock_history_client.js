
var MockHistoryClient = Class.extend({

  _sHistoryItemsFile : "data/client/history_items.json",
  _sVisitItemsFile : "data/client/visit_items.json",
  _lHistoryItems : undefined,
  _lVisitItems : undefined,

  init: function() {
    var self = this;
  },

  getVisits : function(dParams, mCallback) {
    var self = this;
    var lVisitItems = [];
    // find the id.
    var iHistoryItemId;
    for (var i= 0, dHistoryItems; dHistoryItems = this._lHistoryItems[i]; i++) {
      if (dHistoryItems['url'] == dParams['url']) {
        iHistoryItemId = dHistoryItems['id'];
        break;
      }
    }
    for (var i=0, dVisitItems; dVisitItems = this._lVisitItems[i]; i++) {
      if (dVisitItems['id'] == iHistoryItemId) {
        lVisitItems.push(dVisitItems);
      }
    }
    mCallback(lVisitItems);
  },

  get : function(dParams, mCallback) {

     $.getJSON(this._sHistoryItemsFile, function(lHistoryItems) {
      self._lHistoryItems = lHistoryItems;
      mCallback(self._lHistoryItems);
     });
  },
});

