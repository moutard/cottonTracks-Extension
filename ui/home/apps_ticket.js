'use strict';

/**
 * Each apps tickets correspons to an extension installed on Chrome.
 */
Cotton.UI.Home.AppsTicket = Class
    .extend({

      _$appsTicket : null,

      init : function(oGrid, oExtensionInfo) {
        var $ticket = this._$appsticket = $('<div class="ct-ticket"></div>');
        var $ticketImage = $('<img class="ct-ticketImage"/>');
        var $ticketHead = $('<div class="ct-ticketHead"></div>');
        // var $ticketCount = $('<div class="ct-ticketCount"><b
        // class="ct-ticketCountNumber">99</b> stories</div>');
        var $ticketTitle = $('<h3></h3>');
        var $ticketLink = $('<a class="ct-ticketLink"></div>');

        $ticket.append($ticketLink, $ticketImage, $ticketHead
            .append($ticketTitle));

        $ticketLink.append($ticketImage);
        $ticketImage.attr('src', _.max(oExtensionInfo.icons,
            function(oIconInfo) {
              return oIconInfo.size;
            }).url);
        // $ticket.css('background-image', 'url(' + sImageUrl + ')');
        // $ticketCount.find('.ct-ticketCountNumber').html(iStoryCount);
        $ticketTitle.text(oExtensionInfo.name);
        $ticketLink.attr('href', oExtensionInfo.appLaunchUrl);

        oGrid.append($ticket);
      }
    });
