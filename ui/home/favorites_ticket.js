'use strict';

Cotton.UI.Home.FavoritesTicket = Class.extend({

  _$ticket : null,

  init : function(oFavoritesGrid, sImageUrl, iStoryCount, sTitle, sSiteUrl) {
    var $ticket = this._$ticket = $('<div class="ct-ticket"></div>');

    var $ticketLink = $('<a class="ct-ticketLink"></div>');
    var $ticketImage = $('<img class="ct-ticketImage"/>');
    var $ticketHead = $('<div class="ct-ticketHead"></div>');
    var $ticketCount = $('<div class="ct-ticketCount"><b class="ct-ticketCountNumber">99</b> stories</div>');
    var $ticketTitle = $('<h3></h3>');

    $ticket.append($ticketLink, $ticketImage, $ticketHead.append(
        $ticketCount, $ticketTitle));

    $ticketLink.append($ticketImage);
    $ticketImage.attr('src', sImageUrl);
    // $ticket.css('background-image', 'url(' + sImageUrl + ')');
    $ticketCount.find('.ct-ticketCountNumber').html(iStoryCount);
    $ticketTitle.text(sTitle);
    $ticketLink.attr('href', sSiteUrl);

    oFavoritesGrid.append($ticket);
  }
});
