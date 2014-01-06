"use strict";

Cotton.UI.ProtoSwitch.UIProtoSwitch = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._$proto_switch = $('<div class="ct-proto_switch"></div>').click(function(e){
      if (e.target === this) {
        oGlobalDispatcher.publish('toggle_switch');
      }
    });

    // Actual proto_switch box.
    this._$box = $('<div class="ct-proto_switch_box"></div>');

    // email form
    this._oForm = new Cotton.UI.ProtoSwitch.Form(oGlobalDispatcher);

    // Exit protoswitch when ESC key is press down.
    this._oGlobalDispatcher.subscribe('escape', this, function(){
      oGlobalDispatcher.publish('toggle_switch');
    });

    this._$proto_switch.append(
      this._$box.append(
        this._oForm.$()
      )
    );
  },

  $ : function() {
    return this._$proto_switch;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('escape', this);
    this._oGlobalDispatcher = null;
    this._oForm.purge();
    this._$box.remove();
    this._$box = null;
    this._$proto_switch.remove();
    this._$proto_switch = null;
  }
});