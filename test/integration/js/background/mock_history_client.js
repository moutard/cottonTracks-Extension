
var MockHistoryClient = Class.extend({

  _sHistoryItemsFile : "data/client/history_items.json",
  _sVisitItemsFile : "data/client/visit_items.json",
  _lHistoryItems : undefined,
  _lVisitItems : undefined,

  init: function() {
    var self = this;
    self._lHistoryItems = _history_items;
    self._lVisitItems = _visit_items;
  },

  getVisits : function(dParams, mCallback) {
    var self = this;
    var lVisitItems = [];
    // find the id.
    var iHistoryItemId;
    var iLength = this._lHistoryItems.length;
    for (var i= 0; i < iLength; i++) {
      var dHistoryItems = this._lHistoryItems[i];
      if (dHistoryItems['url'] == dParams['url']) {
        iHistoryItemId = dHistoryItems['id'];
        break;
      }
    }
    var iLength = this._lVisitItems.length;
    for (var i=0; i < iLength; i++) {
      var dVisitItems = this._lVisitItems[i];
      if (dVisitItems['id'] == iHistoryItemId) {
        lVisitItems.push(dVisitItems);
      }
    }
    mCallback(lVisitItems);
  },

  get : function(dParams, mCallback) {
    var self = this;
     //$.getJSON(this._sHistoryItemsFile, function(lHistoryItems) {
      mCallback(self._lHistoryItems);
     //});
  },
});

