'use strict';

/**
 * Each apps tickets correspons to an extension installed on Chrome.
 */
Cotton.UI.Home.AppsTicket = Class
    .extend({

      _$ticket : null,

      _$ticket_image : null,
      _$ticket_head : null,
      _$ticket_title : null,
      _$ticket_link : null,

      init : function(oGrid, oExtensionInfo) {
        var self = this;
        self._$ticket = $('<div class="ct-ticket"></div>');
        self._$ticket_image = $('<img class="ct-ticket_image"/>');
        self._$ticket_head = $('<div class="ct-ticket_head"></div>');

        self._$ticket_title = $('<h3></h3>');
        self._$ticket_link = $('<a class="ct-ticket_link"></div>');

        self._$ticket_image.attr('src', _.max(oExtensionInfo.icons,
            function(oIconInfo) {
              return oIconInfo.size;
            }).url);

        self._$ticket_title.text(oExtensionInfo.name);
        self._$ticket_link.attr('href', oExtensionInfo.appLaunchUrl);

        self._$ticket.append(self._$ticket_link.append(self._$ticket_image),
            self._$ticket_head.append(self._$ticket_title));
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
        this.setWidth(Cotton.UI.Home.Apps.SMALL_WIDTH);
        this.setMargin(Cotton.UI.Home.Apps.SMALL_MARGIN);
        this._$ticket_title.css('font-size', '12px');
        this._$ticket_head.css('padding-top', '10px');
        this._$ticket_head.css('padding-top', '5px');
      },

      setMedium : function() {
        this.setWidth(Cotton.UI.Home.Apps.MEDIUM_WIDTH);
        this.setMargin(Cotton.UI.Home.Apps.MEDIUM_MARGIN);
        this._$ticket_title.css('font-size', '12px');
        this._$ticket_head.css('padding-top', '18px');
        this._$ticket_head.css('padding-top', '8px');
      },

      setLarge : function() {
        this.setWidth(Cotton.UI.Home.Apps.LARGE_WIDTH);
        this.setMargin(Cotton.UI.Home.Apps.LARGE_MARGIN);
        this._$ticket_title.css('font-size', '16px');
        this._$ticket_head.css('padding-top', '20px');
        this._$ticket_head.css('padding-top', '10px');
      },


    });
