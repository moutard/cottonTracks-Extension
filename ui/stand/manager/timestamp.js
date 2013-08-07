"use strict";

/**
 * Class that display the date follow by an horizontal date in the journal.
 */
Cotton.UI.Stand.Manager.TimeStamp = Class.extend({

  /**
   * {DOM} Current element,
   * contains the horizontal line with a date to separate 2 periods of times.
   */
  _$timestamp : null,

  /**
   * {DOM} date of the timestamp
   */
  _$date : null,

  /**
   * @param {float}
   *          fTomorrow: reference date.
   * @param {float}
   *          fTime: time of the last visit time of elements in the shelf.
   */
  init : function(fTomorrow, fTime, sScale) {
    this._$timestamp = $('<div class="ct-timestamp"></div>');
    this._$date = $('<div class="ct-timestamp_date">' + oDate + '</div>');

    // Construct element.
    this._$timestamp.append(this._$date);
  },

  $ : function() {
    return this._$timestamp;
  },

  purge : function() {
    this._$date.remove();
    this._$date = null;

    this._$timestamp.empty().remove();
    this._$timestamp = null;
  }

});
