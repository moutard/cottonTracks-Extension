'use strict';

/**
 *   Settings button
 **/

Cotton.UI.SideMenu.Settings = Class.extend({

  _oMenu : null,

  init : function(oDispatcher){
    var self = this;
    this._oDispatcher = oDispatcher;

    this._$settings = $('<div class="ct-settings"><h3>Back to other Stories</h3></div>');

    //set value

    //trigger settings page
    this._$settings.click(function(){
      self._oDispatcher.publish('open_manager');
    });
  },

  $ : function(){
    return this._$settings;
  }
});
