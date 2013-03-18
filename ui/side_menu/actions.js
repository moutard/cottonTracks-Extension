'use strict';

/**
 *   Actions for the story (share, comment, star)
 **/

Cotton.UI.SideMenu.Actions = Class.extend({

  _oSumUp : null,
  _$actions : null,
  _$star : null,
  _$comment : null,
  _$share : null,

  init: function(oSumUp){

	  this._oSumUp = oSumUp;
	  this._$actions = $('<div class="ct-actions"></div>');
	  this._$star = $('<div class="ct-action star"></div>');
		this._$comment = $('<div class="ct-action comment"></div>');
		this._$share = $('<div class="ct-action share"></div>');

    //construct element
	  this._$actions.append(
		  this._$star,
		  this._$comment,
      this._$share
	  );

	  this._$actions.children().click(function(){
		  //do something
	  });
  },

  $ : function(){
	  return this._$actions;
  },

  sumUp : function(){
	  return this._oSumUp;
  },

});