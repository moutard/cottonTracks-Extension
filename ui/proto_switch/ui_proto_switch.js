"uste strict";

Cotton.UI.ProtoSwitch.UIProtoSwitch = Class.extend({

  init : function(oGlobalDispatcher) {
    this._$proto_switch = $('<div class="ct-proto_switch"></div>');

    // Actual proto_switch box.
    this._$box = $('<div class="ct-proto_switch_box"></div>');

    // email form
    this._oForm = new Cotton.UI.ProtoSwitch.Form(oGlobalDispatcher);

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
    this._$box.remove();
    this._$box = null;
    this._$proto_switch.remove();
    this._$proto_switch = null;
  }
});