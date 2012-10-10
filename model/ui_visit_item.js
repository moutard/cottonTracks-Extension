'use strict';

/**
 * VisitItem handle UI.
 */
Cotton.Model.UIVisitItem = Class
    .extend({

      _sId : undefined, // UIVisitItemId.
      _sVisitItemId : undefined, // Should be the corresponding Cotton.Model.VisitItem

      // Information needed to remember the display.
      _iImageCropped : 0,
      _iImageMarginTop : 0,
      _iSortablePosition : undefined,

      /**
       * @constructor
       */
      init : function() {

      },

      id : function() {
        return this._sId;
      },
      initId : function(sId) {
        if(this._sId === undefined){this._sId = sId;}
      },
      visitItemId : function() {
        return this._sVisitItemId;
      },
      setVisitItemId : function(sVisitItemId) {
        this._sVisitItemId = sVisitItemId;
      },
      imageCropped : function(){
        return this._iImageCrop;
      },
      setImageCropped : function(isCropped){
        this._iImageCropped = isCropped;
      },
      imageMarginTop : function(){
        return this._iImageMarginTop;
      },
      setImageMarginTop : function(iMarginTop){
        this._iImageMarginTop = iMarginTop;
      },
      sortablePosition : function(){
        return this._iSortablePosition;
      },
      setSortablePosition : function(iSortablePosition){
        this._iSortablePosition = iSortablePosition;
      },


  });
