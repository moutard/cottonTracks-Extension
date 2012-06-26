'use strict';

/**
 * Each apps tickets correspons to an extension installed on Chrome.
 */
Cotton.UI.Homepage.AppsTicket = Class
    .extend({

      _$appsTicket : null,

      init : function(oGrid, sImageUrl, iStoryCount, sTitle, sSiteUrl) {
        var $ticket = this._$appsticket = $('<div class="ct-ticket"></div>');
        var $ticketImage = $('<img class="ct-ticketImage"/>');
        var $ticketHead = $('<div class="ct-ticketHead"></div>');
        var $ticketCount = $('<div class="ct-ticketCount"><b class="ct-ticketCountNumber">99</b> stories</div>');
        var $ticketTitle = $('<h3></h3>');
        var $ticketLink = $('<a class="ct-ticketLink"></div>');

        $ticket.append($ticketLink, $ticketImage, $ticketHead.append(
            $ticketCount, $ticketTitle));

        $ticketLink.append($ticketImage);
        $ticketImage.attr('src', sImageUrl);
        // $ticket.css('background-image', 'url(' + sImageUrl + ')');
        $ticketCount.find('.ct-ticketCountNumber').html(iStoryCount);
        $ticketTitle.text(sTitle);
        $ticketLink.attr('href', sSiteUrl);

        oGrid.append($ticket);
      }
    });
