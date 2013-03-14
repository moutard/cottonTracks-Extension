'use strict';

/**
 * ToolsContainer this class provides some methods to class and identify tools
 */
Cotton.Utils.ToolsContainer = Class.extend({

  _lTools : undefined,

  /**
   * @constructor
   */
  init : function() {
    var lCommonToolsHostname = Cotton.Config.Parameters.lTools;
    this._lTools = new Array();
    for ( var i = 0, iLength; i < iLength; i++) {
      this.insert(lCommonToolsHostname[i]);
    }
  },

  tools : function() {
    return this._lTools;
  },

  alreadyExist : function(sHostname) {
    // return the index of the tool if it exists
    for ( var i = 0, iLength = this._lTools.length; i < iLength; i++) {
      if (this._lTools[i].sHostname === sHostname) {
        return i;
      }
    }

    return -1;
  },

  isTool : function(sHostname) {
    // return the index of the tool if it exists
    for ( var i = 0, iLength = this._lTools.length; i < iLength; i++) {
      if (this._lTools[i].sHostname === sHostname) {
        return true;
      }
    }

    return false;
  },

  insertTool : function(psHostname, pfFrequence) {
    // insert a new tool in lTools
    var oTool;

    if (psHostname == undefined) {
      console.error("Try to construct a Tool with undefined hostname");
      return false;
    } else if (pfFrequence == undefined) {
      pfFrequence = 1; // TODO(rmoutard) : change value
    }

    oTool = new Cotton.Model.Tool(psHostname, pfFrequence);
    // TODO(rmoutard) : sort insertion
    this._lTools.push(oTool);
    return true;
  },

  increaseFrequency : function(piIndex) {
    if (piIndex < this._lTools.length && piIndex >= 0) {
      this._lTools[piIndex].increaseFrequency();
      return true;
    } else {
      console.error("you try to modifiy a index out of bounce");
      return false;
    }
  },

  insert : function(psHostname) {
    var iIndex = this.alreadyExist(psHostname);

    if (iIndex === -1) {
      this.insertTool(psHostname);
    } else {
      this.increaseFrequency(iIndex);
    }

  },

  favoriteTools : function() {
    this._lTools.sort(function(oTool1, oTool2) {
      return oTool2.frequency() - oTool1.frequency();
    });
    return this._lTools.slice(0, 20);
  },

});
