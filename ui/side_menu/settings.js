'use strict';

Cotton.UI.SideMenu.Settings = Class.extend({
	
	_oMenu : null,
	
	init : function(oMenu){		
		this._oMenu = oMenu;

    this._$settings = $('<div class="ct-settings"></div>');

    //set value
    var sSettings = '<div class="settings_icon"></div> Settings';
    this._$settings.html(sSettings);

	  //trigger settings page
	  this._$settings.click(function(){
		  //do something
	  });
	},

  $ : function(){
	  return this._$settings;
  }
});