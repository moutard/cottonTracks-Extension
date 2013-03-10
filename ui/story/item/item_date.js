'use strict';

/**
 * Item Date Contains clock icon and date
 */
Cotton.UI.Story.Item.Date = Class.extend({

  _oItemContent : null,

  _$itemDate : null,
  _$date : null,
  _$clock : null,

  init : function(oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

    // current element
    this._$itemDate = $('<div class="ct-item_date"></div>');

    // current sub elements
    this._$clock = $('<img src="media/images/story/item/date_clock.png"/>')
    this._$date = $('<h4></h4>');

    // set date
    var oDate = new Date(this._oItemContent._oItem._oHistoryItem.lastVisitTime());
    var sDay = oDate.getDate();
    var lMonth = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    var sMonth = lMonth[oDate.getMonth()];
    if (oDate.getHours() < 12){
      var sHours = oDate.getHours();
      var sAmPm = "am";
    } else if (oDate.getHours() == 12){
      var sHours = oDate.getHours();
      var sAmPm = "pm";
    } else {
      var sHours = oDate.getHours() - 12;
      var sAmPm = "pm";
    }
    var sMinutes = oDate.getMinutes();
    this._$date.text(sDay + " " + sMonth + " - " + sHours + ":" + sMinutes + " " + sAmPm);

    // construct item
    self._$itemDate.append(self._$clock, self._$date);

  },

  $ : function() {
    return this._$itemDate;
  }

});
