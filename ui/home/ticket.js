'use strict';

/**
 * Ticket
 */
Cotton.UI.Home.Ticket = Class.extend({

  /**
   * Grid
   */
  _oGrid : null,
  _$ticket : null,

  _$ticket_image : null,
  _$ticket_head : null,
  _$ticket_title : null,
  _$ticket_link : null,

  init : function(oGrid, sImageUrl, sTitle, sSiteUrl) {
    var self = this;

    self._oGrid = oGrid;

    self._$ticket = $('<div class="ct-ticket"></div>');
    self._$ticket_image = $('<img class="ct-ticketImage"/>');
    self._$ticket_head = $('<div class="ct-ticketHead"></div>')
    self._$ticket_title = $('<h3></h3>');
    self._$ticket_link = $('<a class="ct-ticketLink"></div>');

    self._$ticket_image.attr('src', sImageUrl);
    self._$ticket_title.text(sTitle);
    self._$ticket_link.attr('href', sSiteUrl);

    self._$ticket.append(self._$ticket_link.append(self._$ticket_image),
                          self._$ticket_head.append(self._$ticket_title));

    //oGrid.append($ticket);

  },

  $ : function() {
    return this._$ticket;
  },
});
