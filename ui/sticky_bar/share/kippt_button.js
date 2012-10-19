'use strict';

/**
 * Share functionality.
 *
 */
Cotton.UI.StickyBar.Share.KipptButton = Class.extend({

  _$kippt_button: null,
  _$kippt_icon: null,
  _$kippt_title: null,

  init: function(){
    var self = this;
    this._$kippt_icon = $('<img src="/media/images/topbar/share/kippt.png"></img>');
    this._$kippt_title = $('<h2>Kippt it</h2>');
    this._$kippt_button = $('<div class="ct-social_button ct-kippt"></div>').append(
      this._$kippt_icon,
      this._$kippt_title
    );

    this._$kippt_button.click(function(){
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
    }).done(function(data){
        var useriD = data['id'];
        localStorage.setItem('kipptUserId', data['id']);

        $.each(data.services, function(name, connected) {
            if (connected) {
            }
        });
        self.shareOnKippt();
    }).fail(function(jqXHR, textStatus){
      chrome.tabs.create({
        'url': 'https://kippt.com/login/',
        'selected': true
      });
    });

  },

  shareOnKippt : function(){
    if(_oCurrentlyOpenStoryline){
      // Create a list
      var type = 'POST';
      var list_url = 'https://kippt.com/api/lists/';
      var clip_url = 'https://kippt.com/api/clips/';

      var list_data = JSON.stringify({
        'title': _oCurrentlyOpenStoryline.story().title()
      });

      $.ajax({
            'url': list_url,
            'type': type,
            'dataType': 'json',
            'data': list_data
      }).done(function(sResponse){
        var dResponse = sResponse;
        // For each item create a new clip and put it in the list.
        // The list is defined not by this id but by the resource_uri,
        // that contain this id.
        _.each(_oCurrentlyOpenStoryline.story().visitItems(), function(oVisitItem){
          var clip_data = JSON.stringify({
            'url': oVisitItem.url(),
            'list': dResponse['resource_uri']
          });

          $.ajax({
              'url': clip_url,
              'type': type,
              'dataType': 'json',
              'data': clip_data
          }).done(function(){
          }).fail(function(jqXHR, textStatus){
              alert( "Something went wrong when saving. Try again or contact hello@kippt.com");
          });
        });

      }).fail(function(jqXHR, textStatus){
            alert( "Something went wrong when saving. Try again or contact hello@kippt.com");
      });


    } else {
      console.log("Nothing to share");
    }
  },

});
