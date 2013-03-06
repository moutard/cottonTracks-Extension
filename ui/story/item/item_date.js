'use strict';

/**
 * Item Date Contains date and clock icon
 */
Cotton.UI.Story.Item.Date = Class
    .extend({

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

        // current sub element
        this._$clock = $('<img src="media/images/story/item/date_clock.png"/>')
        this._$date = $('<h4></h4>');

        // date
        var oDate = new Date(this._oItemContent._oItem._oVisitItem.visitTime());
        var lDate = oDate.toDateString().split(" ");
        this._$date.text(lDate[2] + " " + lDate[1]);

        // construct item
        self._$itemDate.append(self._$clock, self._$date);

      },

      $ : function() {
        return this._$itemDate;
      },

      appendTo : function(oItemContent) {
        oItemContent.$().append(this._$itemDate);
      },

    });
