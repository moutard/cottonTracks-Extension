var HistoryItemsSingleton = (function() {
  var instantiated;
  function init(plHistoryItems) {
    // all singleton code goes here
    return {
      publicWhatever : function() {
        alert('whatever')
      },
      publicProperty : 2,
      lHistoryItems : plHistoryItems
    }
  }

  return {
    getInstance : function(plHistoryItems) {
      if (!instantiated) {
        instantiated = init(plHistoryItems);
      }
      return instantiated;
    }
  }
})();