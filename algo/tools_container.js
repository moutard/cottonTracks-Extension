'use strict';

Cotton.Algo.ToolsContainer = Class.extend({
  // CLASS : ToolsContainer
  // this class provides some methods to class and identify tools
  init : function() {
    var lCommonToolsHostname = Cotton.Config.Parameters.lTools;
    this.lTools = new Array();
    for ( var i = 0; i < lCommonToolsHostname.length; i++) {
      this.insert(lCommonToolsHostname[i]);
    }
  },

  // PROTOTYPE : ToolsContainer
  alreadyExist : function(sHostname) {
    // return the index of the tool if it exists
    for ( var i = 0; i < this.lTools.length; i++) {
      if (this.lTools[i].sHostname === sHostname) {
        return i;
      }
    }

    return -1;
  },

  insertTool : function(psHostname, pfFrequence) {
    // insert a new tool in lTools
    // TODO(rmoutard) : sort insertion
    var oTool;

    if (psHostname == undefined) {
      console.error("Try to construct a Tool with undefined hostname");
      return false;
    } else if (pfFrequence == undefined) {
      pfFrequence = 1; // TODO(rmoutard) : change value
    }

    oTool = new Tool(psHostname, pfFrequence);
    // TODO(rmoutard) : sort insertion
    this.lTools.push(oTool);
    return true;
  },

  increaseFrequence : function(piIndex) {
    if (piIndex < this.lTools.length && piIndex >= 0) {
      this.lTools[piIndex].fFrequence += 1;
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
      this.increaseFrequence(iIndex);
    }

  },

  favoriteTools : function() {
    this.lTools.sort(sortToolByFrequence);
    return this.lTools.slice(0, 20);
  },

});