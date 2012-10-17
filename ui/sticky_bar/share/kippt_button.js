'use strict';

/**
 * Share functionality.
 *
 */
Cotton.UI.StickyBar.Share.KipptButton = Class.extend({

  _$kippt_button: null,

  init: function(){
    var self = this;
    this._$kippt_button = $('<div class="ct-kippt_button">Kippt it</div>').click(function(){
      self.connectOnKippt();
    });
  },

  $ : function(){
    return this._$kippt_button;
  },

  connectOnKippt : function(){
    var self = this;
    $.ajax({
        url: 'https://kippt.com/api/account/?include_data=services',
        type: "GET",
        dataType: 'json'
    })
    .done(function(data){
        var useriD = data['id'];
        localStorage.setItem('kipptUserId', data['id']);

        $.each(data.services, function(name, connected) {
            if (connected) {
                //$("#kippt-actions ." + name).toggleClass("connected", connected);
                //$("#kippt-actions ." + name).css('display', 'inline-block');
            }
        });
        self.shareOnKippt();
    })
    .fail(function(jqXHR, textStatus){
        // Logged out user, open login page
        //Kippt.openTab('https://kippt.com/login/');
        //Kippt.closePopover();
    });

  },

  shareOnKippt : function(){
    if(_oCurrentlyOpenStoryline){
      var type = 'POST';
      var url = 'https://kippt.com/api/clips/';

      _.each(_oCurrentlyOpenStoryline.story().visitItems(), function(oVisitItem){
        var msg = JSON.stringify({url: oVisitItem.url()});

        $.ajax({
            url: url,
            type: type,
            dataType: 'json',
            data: msg
        })
        .done(function(){
            // Clear page cache
            //localStorage.removeItem('cache-title');
            //localStorage.removeItem('cache-notes');
        })
        .fail(function(jqXHR, textStatus){
            alert( "Something went wrong when saving. Try again or contact hello@kippt.com");
        });
    });
    } else {
      console.log("Nothing to share");
    }
  },

});