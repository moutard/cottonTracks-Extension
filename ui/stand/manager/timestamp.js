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
  init : function(dArguments) {
    var sTitle = dArguments['title'] || this._computeTitle(dArguments);
    this._$timestamp = $('<div class="ct-timestamp"></div>');
    this._$date = $('<div class="ct-timestamp_date">' + sTitle + '</div>');

    // Construct element.
    this._$timestamp.append(this._$date);
  },

  $ : function() {
    return this._$timestamp;
  },

  /**
   * Given the reference and the time of the shelf return the title that
   * will be display (like TODAY, YESTERDAY 3 MONTHS AGO).
   * @param {float}
   *          fTomorrow: reference date.
   * @param {float}
   *          fTime: time of the last visit time of elements in the shelf.
   */
  _computeTitle : function(dArguments) {
    var fTomorrow = dArguments['tomorrow'];
    var fTime = dArguments['time'];
    var bIsCompleteMonth = dArguments['isCompleteMonth'];
    // the reference is tomorrow 00:00
    var iDaysOld = Math.floor((fTomorrow - fTime) / 86400000);
    var sDate = "";
    if (iDaysOld === 0) {
      sDate = "TODAY";
    } else if (iDaysOld === 1) {
      sDate = "YESTERDAY";
    } else if (iDaysOld < 7) {
      sDate = iDaysOld + " DAYS AGO";
    } else if (iDaysOld < 14) {
      sDate = "A WEEK AGO";
    } else if (iDaysOld < 21) {
      sDate = "2 WEEKS AGO";
    } else {
      var MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
      sDate = MONTHS[new Date(fTime).getMonth()] + " " + new Date(fTime).getFullYear();
      if (!bIsCompleteMonth)  sDate = "EARLIER IN " + sDate;
    }
    return sDate;
  },

  purge : function() {
    this._$date.remove();
    this._$date = null;

    this._$timestamp.empty().remove();
    this._$timestamp = null;
  }

});
