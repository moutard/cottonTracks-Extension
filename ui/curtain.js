'use strict';

Cotton.UI.Curtain = Class.extend({
  _$gears :  null,
  _$progressBar : null,
  _$percentage : null,
  _iPercentage : 0,

  init : function(){
    this._$gears = $('.gear');
    this._$progressBar = $('.meter');
    this._$percentage = $('.percentage');
  },

  percentage : function() {
    return  this._iPercentage;
  },

  /**
   * @param {int} : iPercentage this value should be between 0 and 100.
   */
  setPercentage : function(iPercentage){
    this._iPerecentage = iPercentage;

    // set the ui.
    this.set$percent(iPercentage);
  },

  start : function(){
    this._$gears.find('.shine').addClass('animate');
    this._$gears.find('.perspective').addClass('animate');
  },

  stop : function(){
    this._$gears.find('.shine').removeClass('animate');
    this._$gears.find('.perspective').removeClass('animate');
  },
});
