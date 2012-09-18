'use strict';

Cotton.UI.Home.Ticket = Class
    .extend({

      _$ticket : null,

      init : function(oGrid, sImageUrl, iStoryCount, sTitle, sSiteUrl) {
        var $ticket = this._$ticket = $('<div class="ct-ticket"></div>');
        var $ticketImage = $('<img class="ct-ticketImage"/>');
        //var $ticketHead = $('<div class="ct-ticketHead"></div>')
        var $ticketEnvelope = $('<img class="ct-ticketEnvelope" src ="/media/images/home/ticket_bottom.png">')
        var $ticketCount = $('<div class="ct-ticketCount"><b class="ct-ticketCountNumber">99</b> stories</div>');
        var $ticketTitle = $('<h3></h3>');
        var $ticketLink = $('<a class="ct-ticketLink"></div>');

       // $ticket.append($ticketLink, $ticketImage, $ticketHead.append(
       //     $ticketCount, $ticketTitle));

       //test
       $ticket.append($ticketLink, $ticketEnvelope, $ticketImage, $ticketCount, $ticketTitle);

        $ticketLink.append($ticketImage);
        $ticketImage.attr('src', sImageUrl);
        // $ticket.css('background-image', 'url(' + sImageUrl + ')');
        $ticketCount.find('.ct-ticketCountNumber').html(iStoryCount);
        $ticketTitle.text(sTitle);
        $ticketLink.attr('href', sSiteUrl);

        oGrid.append($ticket);
      }
    });
