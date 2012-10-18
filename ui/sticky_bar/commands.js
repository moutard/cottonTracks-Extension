'use strict'
/**
 * Commands bar in the StickyBar.
 *
 * Contains all the button. - homepage  search
 */
Cotton.UI.StickyBar.Commands = Class.extend({

  _oBar : null,

  _$commands : null,

  _$homepage_button : null,
  _$search_button : null,
  _$logo_button : null,
  _$recent_button : null,
  _$share_button : null,
  _$settings_button : null,

  _oSocialButtons : null,

  /**
   * @constructor
   */
  init : function(oBar) {
    var self = this;
    this._oBar = oBar;
    this._$commands = $('.ct-commands');

    // Sub elements
    this._$homepage_button = $('.ct-icon_button_home');
    this._$search_button = $('.ct-icon_button_search');

    this._$logo_button = $('.ct-icon_button_logo');

    this._$recent_button = $('.ct-icon_button_recent');
    this._$share_button = $('.ct-icon_button_share');

    this._$settings_button = $('.ct-icon_button_settings');
    this._oSocialButtons = new Cotton.UI.StickyBar.Share.SocialButtons();

    this._$homepage_button.click(function() {
      Cotton.UI.Home.HOMEPAGE.show();
      self._oBar.open();
    });

    this._$logo_button.click(function() {
      self._oBar.openClose();
    });

    this._$settings_button.click(function(){
      document.location.href="settings/settings.html"
    }).qtip({
      'content' : 'Settings',
      'position' : {
        'my' : 'top center',
        'at' : 'bottom left'
      },
      'show' : 'mouseover',
      'hide' : 'mouseleave',
      'style' : {
        'tip' : true,
        'classes' : 'ui-tooltip-yellow'
      }
    });

    // Unused button
    var dQtipParameters = {
      'content' : 'Non available yet',
      'position' : {
        'my' : 'top left',
        'at' : 'bottom center'
      },
      'show' : 'click',
      'hide' : 'mouseleave',
      'style' : {
        'tip' : true,
        'classes' : 'ui-tooltip-red'
      }
    };

    this._$search_button.qtip(dQtipParameters);
    this._$recent_button.qtip(dQtipParameters);
    this._$share_button.append(self._oSocialButtons.$()).click(function(){
      self.openShareButtons();
    });

  },

  /**
   * @return {HtmlElement}
   */
  $ : function() {
    return this._$commands;
  },

  openShareButtons : function(){
    this._oSocialButtons.open();
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
