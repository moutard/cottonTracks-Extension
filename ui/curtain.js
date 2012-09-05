'use strict';

Cotton.UI.Curtain = Class.extend({
  _$gears :  null,
  _$meter : null,
  _$progressBar : null,
  _$percentage : null,
  _iPercentage : 20,
  _oErrorHandler : null,
  _$pError : null,

  init : function($window){
    this._$gears = $('.gear');
    this._$progressBar = $('.progress_bar');
    this._$percentage = $('.percentage');
    this._$meter = $('.meter');
    this._oErrorHandler = new Cotton.UI.ErrorHandler(this, $window);
    this._$pError = $('<p class="error"></p>');
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
    var toPercentage = Math.max(0,
                                Math.min(100, this._iPercentage + iPercentage));

    // set the ui.
    this._increase$percentage(toPercentage);
    this.setProgressBar(toPercentage);
  },

  _increase$percentage : function(toPercentage){
    var self = this;
    var fromPercentage = this._iPercentage;
    var iTemp = fromPercentage;
    for( var i=fromPercentage; i <= toPercentage; i++){
      setTimeout(function(){
        console.log(iTemp);
        $('.percentage').text(iTemp + '%');
        iTemp+=1;
      }, (i - fromPercentage) * 50);
    }
   this._iPercentage = toPercentage;
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

  displayError: function(sMessage, sUrl, iLine){
    this.stop();
    this._$meter.addClass("red");
    this._$metter.removeClass("yellow");
  },
});
