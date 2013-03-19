'use strict';

/**
 * Item Date Contains clock icon and date
 */
Cotton.UI.Story.Item.Content.Date = Class.extend({

  _oItemContent : null,

  _iLastVisitTime : null,

  _$contentDate : null,
  _$date : null,
  _$clock : null,

  init : function(iLastVisitTime, oItemContent) {
    var self = this;

    // current parent element.
    this._oItemContent = oItemContent;

    this._iLastVisitTime = iLastVisitTime;

    // current element
    this._$contentDate = $('<div class="ct-item_content_date"></div>');

    // current sub elements
    this._$clock = $('<img src="media/images/story/item/date_clock.png"/>')
    this._$date = $('<h4></h4>');

    // set date
    var oDate = new Date(iLastVisitTime);
    var sDay = oDate.getDate();
    // TODO(rmoutard) use moment.js
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
    self._$contentDate.append(self._$clock, self._$date);

  },

  $ : function() {
    return this._$contentDate;
  }

});
