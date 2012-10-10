'use strict';

Cotton.Translators.UI_VISIT_ITEM_TRANSLATORS = [];

// Translator for version 0.1.
(function() {

  var mObjectToDbRecordConverter = function(oUIVisitItem) {

    var dDbRecord = {
      'iImageCropped' : oUIVisitItem.imageCropped(),
      'iImageMarginTop' : oUIVisitItem.imageMarginTop(),
      'iSortablePosition' : oVisitItem.sortablePosition(),
    };

    // Simple configuration.
    if (oUIVisitItem.id() !== undefined) {
      // else id will be auto-incremented by engine. Because its the first time
      // you add this visitItem.
      dDbRecord.id = oUIVisitItem.id();
    }

    if (oUIVisitItem.visitItemId() !== undefined) {
      dDbRecord.sVisitItemId = oUIVisitItem.visitItemId();
    }

    return dDbRecord;
  };

  var mDbRecordToObjectConverter = function(oDbRecord) {
    // oDbRecord is just a dictionnary
    var oUIVisitItem = new Cotton.Model.UIVisitItem();
    // Use private attributes because they are immutable.
    oUIVisitItem.initId(oDbRecord['id']);
    oUIVisitItem.setVisitItemId(oDbRecord['sVisitItemId']);

    oUIVisitItem.setImageCropped(oDbRecord['iImageCropped']);
    oUIVisitItem.setImageMarginTop(oDbRecord['iImageMarginTop']);
    oUIVisitItem.setSortablePosition(oDbRecord['iSortablePosition']);

     return oUIVisitItem;
  };

  var dIndexes = {
    'id' : {
      'unique' : true
    },
    'iVisitItemId' : {
      'unique' : true
    },
  };

  var oTranslator = new Cotton.DB.Translator('0.1', mObjectToDbRecordConverter,
      mDbRecordToObjectConverter, dIndexes);
  Cotton.Translators.UI_VISIT_ITEM_TRANSLATORS.push(oTranslator);

})();
