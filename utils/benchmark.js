'use strict';

var Benchmark = Class.extend({

  _sName: undefined,
  _iStartTime: 0,
  _iPreviousStepTime: 0,
  _iCurrentStepTime: 0,

  init: function(sName){
    this._sName = sName;
    this._iStartTime = this._iPreviousStepTime = this._iCurrentStepTime = new Date().getTime();
  },

  start: function(){
    this._iStartTime = this._iPreviousStepTime = this._iCurrentStepTime = new Date().getTime();
  },

  step: function(sStepName){
    this._iCurrentStepTime =  new Date().getTime();
    var iElapsedTime =  (this._iCurrentStepTime - this._iPreviousStepTime)/1000;
    this._iPreviousStepTime = this._iCurrentStepTime;
    DEBUG && console.debug('@@@ cT|' + this._sName + '|' + sStepName + ': ' +
      + iElapsedTime + ' seconds.');
  },

  end: function(mCallback){
    this._iCurrentStepTime =  new Date().getTime();
    var iElapsedTime =  (this._iCurrentStepTime - this._iStartTime)/1000;
    this._iPreviousStepTime = this._iCurrentStepTime;
    DEBUG && console.debug('@@@ cT|' + this._sName + '| ------ TOTAL ------: '
      + iElapsedTime + ' seconds.');
    if (mCallback) {
      mCallback(iElapsedTime);
    }
  },
});
