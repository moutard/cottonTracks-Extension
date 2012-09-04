'use strict';

Cotton.UI.Curtain = Class.extend({
  _$gears :  null,
  _$meter : null,
  _$progressBar : null,
  _$percentage : null,
  _iPercentage : 0,

  init : function(){
    this._$gears = $('.gear');
    this._$progressBar = $('.progress_bar');
    this._$percentage = $('.percentage');
    this._$meter = $('.meter');
  },

  percentage : function() {
    return  this._iPercentage;
  },

  /**
   * Change the percentage value by the new one.
   * @param {int} : iPercentage this value should be between 0 and 100.
   */
  setPercentage : function(iPercentage){
    this._iPercentage = Math.max(0, Math.min(iPercentage, 100));

    // set the ui.
    this.set$percentage(this._iPercentage);
    this.setProgressBar(this._iPercentage);
  },

  set$percentage : function(iPercentage){
    this._$percentage.text(iPercentage + '%');
  },

  setProgressBar : function(iPercentage){
    this._$progressBar.width(iPercentage + '%');
  },

  /**
   * Increase the percentage, sum it with the given value.
   * @param {int} : iPercentage this value should be between 0 and 100.
   */
  increasePercentage : function(iPercentage){
    this._iPercentage = Math.max(0,
                                Math.min(100, this._iPercentage + iPercentage));

    // set the ui.
    this.set$percentage(this._iPercentage);
    this.setProgressBar(this._iPercentage);
  },

  /**
   * Start animation. (gears + progressbar)
   */
  start : function(){
    this._$gears.find('.shine').addClass('animate');
    this._$gears.find('.perspective').addClass('animate');
    this._$meter.addClass('animate');
  },

  /**
   * Stop animation
   */
  stop : function(){
    this._$gears.find('.shine').removeClass('animate');
    this._$gears.find('.perspective').removeClass('animate');
    this._$meter.removeClass('animate');
  },
});
