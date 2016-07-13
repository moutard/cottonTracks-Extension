'use strict';

/**
 * Score is used to compute the value of pertinence of a given paragraph. See
 * {Cotton.Model.ExtractedParagraph} for the data model link to the database.
 */

Cotton.Behavior.Active.Score = Class
    .extend({

      _iId : undefined,
      _$block : null,
      _fScore : null,

      init : function($block, lQuotes) {
        this._$block = $block;
        this._iId = $block.attr('ct-id');
        this._fScore = 0;
        this._lQuotes = lQuotes || [];
      },

      id : function() {
        return this._iId;
      },

      score : function() {
        return this._fScore;
      },

      setScore : function(fScore) {
        this._fScore = fScore;
      },

      quotes : function() {
        return this._lQuotes;
      },

      addQuote : function(sQuote){
        var iStartIndex = this.text().indexOf(sQuote);
        if (iStartIndex === -1){
          return 0;
        }
        var iEndIndex = iStartIndex + sQuote.length;
        var bMerge = false;
        var lQuotesToRemove = [];
        var iLength = this._lQuotes.length;
        for (var i = 0; i < iLength; i++){
          var dQuote = this._lQuotes[i];
          if ((iStartIndex-dQuote['start'])*(iStartIndex-dQuote['end']) <= 0
            || (iEndIndex-dQuote['start'])*(iEndIndex-dQuote['end']) <= 0
            || (iStartIndex <= dQuote['start'] && iEndIndex >= dQuote['end'])){
              iStartIndex = Math.min(dQuote['start'], iStartIndex);
              iEndIndex = Math.max(dQuote['end'], iEndIndex);
              lQuotesToRemove.push(i);
          }
        }
        var dQuote = {'start': iStartIndex, 'end': iEndIndex};
        this._lQuotes.push(dQuote);
        this.removeQuotes(lQuotesToRemove)
      },

      removeQuotes : function(lQuotesToRemoveIndexes){
        var lQuotes = [];
        var iLength = this._lQuotes.length;
        for (var i = 0; i < iLength; i++){
          var dQuote = this._lQuotes[i];
          if (lQuotesToRemoveIndexes.indexOf(i) === -1){
            lQuotes.push(dQuote);
          }
        }
        this._lQuotes = lQuotes;
      },

      text : function() {
        return this._$block.text();
      },

      serialize : function() {
        var self = this;
        var dDBRecord = {
          'id' : self._iId,
          'sText' : self._$block.text(),
          'fScore' : self._fScore,
          'lQuotes' : self._lQuotes
        };

        return dDBRecord;
      },

      increment : function(fIncrement) {
        this._fScore += fIncrement;
        this._fScore = Math.min(1, this._fScore);
        if (Cotton.Config.Parameters.bDevMode === true) {
          // TODO(fwouts): Use a constant.
          var MIN_COLOR = 128;
          var MAX_COLOR = 255;
          var iColorQuantity = MIN_COLOR
              + Math.round(this._fScore * (MAX_COLOR - MIN_COLOR));
          this._$block.css('background', 'rgb(' + iColorQuantity + ', '
              + iColorQuantity + ', ' + iColorQuantity + ')');
          this._$block.css('color', '#000');
        }
      },

      // TODO(fwouts): Move this method out of there.
      visibleSurface : function() {
        // The score will increase proportionnaly to the visible surface of the
        // block
        // (which depends both on the total surface of the block and the current
        // scroll,
        // which could be hiding part of it).
        var iBlockHeight = this._$block.height();
        var iBlockWidth = this._$block.width();

        var iWindowScrollTop = $(window).scrollTop();
        var iWindowVisibleHeight = window.innerHeight;
        var dBlockOffset = this._$block.offset();
        var iBlockOffsetTop = dBlockOffset.top;
        var iBlockOffsetBottom = dBlockOffset.top + iBlockHeight;

        var iBlockHiddenTop = (iWindowScrollTop < iBlockOffsetTop) ? 0
            : (iWindowScrollTop - iBlockOffsetTop);
        var iBlockHiddenBottom = (iWindowScrollTop + iWindowVisibleHeight > iBlockOffsetBottom) ? 0
            : (iBlockOffsetBottom - (iWindowScrollTop + iWindowVisibleHeight));

        var iVisibleHeight = Math.max(0, iBlockHeight - iBlockHiddenTop
            - iBlockHiddenBottom);
        var iVisibleSurface = iVisibleHeight * iBlockWidth;

        return iVisibleSurface;
      },

      totalSurface : function() {
        var iBlockHeight = this._$block.height();
        var iBlockWidth = this._$block.width();
        return iBlockHeight * iBlockWidth;
      },

    });
