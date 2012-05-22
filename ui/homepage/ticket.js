'use strict';

Cotton.UI.Homepage.Ticket = Class.extend({
  
  _$ticket: null,
  
  init: function(oGrid, sImageUrl, iStoryCount, sTitle) {
    var $ticket = this._$ticket = $('<div class="ct-ticket"></div>');
    var $ticketHead = $('<div class="ct-ticketHead"></div>');
    var $ticketCount = $('<div class="ct-ticketCount"><b class="ct-ticketCountNumber">99</b> stories</div>');
    var $ticketTitle = $('<h3></h3>');
    
    $ticket.append(
        $ticketHead.append(
            $ticketCount,
            $ticketTitle
        )
    );
    
    $ticket.css('background-image', 'url(' + sImageUrl + ')');
    $ticketCount.find('.ct-ticketCountNumber').html(iStoryCount);
    $ticketTitle.text(sTitle);
    
    oGrid.append($ticket);
  }
});
