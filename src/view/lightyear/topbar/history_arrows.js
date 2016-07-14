"use strict";

/**
 * Class handling the history arrows, with their change
 * of color and behavior triggering a next or previous in the history tree
 **/
Cotton.UI.Topbar.HistoryArrows = Class.extend({

  /**
   * General Dispatcher that allows two diffent parts of the product to communicate
   * together through the controller of the app.
   */
  _oGlobalDispatcher : null,

  /**
   * {DOM} contains the two arrows
   **/
  _$arrows : null,

  /**
   * {DOM} left arrow
   **/
  _$left_arrow : null,

  /**
   * {DOM} right arrow
   **/
  _$right_arrow : null,


  init : function(oGlobalDispatcher) {
    var self = this;
    this._oGlobalDispatcher = oGlobalDispatcher;

    this._$arrows = $('<div class="ct-history_arrows"></div>');
    this._$left_arrow = $('<div class="ct-history_arrow_left"></div>').click(function(){
      if (self._iPreviousCount > 0) {
        // there are some previous pages in the history tree
        self._oGlobalDispatcher.publish('previous_page');
      }
    });
    this._$right_arrow = $('<div class="ct-history_arrow_right"></div>').click(function(){
      if (self._iNextCount > 0) {
        // there are some following pages in the history tree
        self._oGlobalDispatcher.publish('next_page');
      }
    });

    this.updateArrows();

    this._oGlobalDispatcher.subscribe('change_history_state', this, function(dArguments){
      // there has been a new page summoned, through a search, story, related, manager
      // or by a previous/next in the browser, or by a previous/next with the arrows
      this.updateArrows(dArguments['state'], dArguments['history_length']);
    });

    this._$arrows.append(this._$left_arrow, this._$right_arrow);
  },

  $ : function() {
    return this._$arrows;
  },


  /**
   * @param {int} iStateCount : position in the history tree
   * @param {int} iHistoryLength : depth of the history tree
   **/
  updateArrows : function(iStateCount, iHistoryLength) {
    // count how many previous and next states are in the history tree
    this._iPreviousCount = iStateCount - 1;
    this._iNextCount = iHistoryLength - iStateCount;
    if (this._iNextCount > 0) {
      // dark arrow and pointer
      this._$right_arrow.addClass('ct-active');
    } else {
      // grey arrow
      this._$right_arrow.removeClass('ct-active');
    }

    if (this._iPreviousCount > 0) {
      // dark arrow and pointer
      this._$left_arrow.addClass('ct-active');
    } else {
      // grey arrow
      this._$left_arrow.removeClass('ct-active');
    }
  }

});