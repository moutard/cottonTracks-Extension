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

    self._$ticket.append(self._$ticket_link.append(self._$ticket_image,
                          self._$ticket_head.append(self._$ticket_title)));

    //oGrid.append($ticket);

  },

  $ : function() {
    return this._$ticket;
  },

  setTop : function(iTop) {
    this._$ticket.css('top', iTop + "px");
  },

  setLeft : function(iLeft) {
    this._$ticket.css('left', iLeft + "px");
  },

  setWidth : function(iWidth) {
    this._$ticket.css('width', iWidth + "px");
  },

  setMargin : function(iMargin) {
    this._$ticket.css('margin-left', iMargin);
    this._$ticket.css('margin-right', iMargin);
  },

  setSmall : function() {
    this.setWidth(Cotton.UI.Home.SMALL_WIDTH_WITHOUT_PADDING);
    this.setMargin(Cotton.UI.Home.SMALL_MARGIN);
    this._$ticket_title.css('font-size', '12px');
    this._$ticket_head.css('padding-top', '10px');
    this._$ticket_head.css('padding-top', '5px');
  },

  setMedium : function() {
    this.setWidth(Cotton.UI.Home.MEDIUM_WIDTH_WITHOUT_PADDING);
    this.setMargin(Cotton.UI.Home.MEDIUM_MARGIN);
    this._$ticket_title.css('font-size', '16px');
    this._$ticket_head.css('padding-top', '18px');
    this._$ticket_head.css('padding-top', '8px');
  },

  setLarge : function() {
    this.setWidth(Cotton.UI.Home.LARGE_WIDTH_WITHOUT_PADDING);
    this.setMargin(Cotton.UI.Home.LARGE_MARGIN);
    this._$ticket_title.css('font-size', '16px');
    this._$ticket_head.css('padding-top', '20px');
    this._$ticket_head.css('padding-top', '10px');
  },
});
