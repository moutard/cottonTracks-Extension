"use strict";

Cotton.UI.ProtoSwitch.UIProtoSwitch = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._$proto_switch = $('<div class="ct-proto_switch"></div>');

    // Actual proto_switch box.
    this._$box = $('<div class="ct-proto_switch_box"></div>');

    // email form
    this._oForm = new Cotton.UI.ProtoSwitch.Form(oGlobalDispatcher);

    // Exit protoswitch by clicking no_thanks.
    this._$dismiss = $('<div class="ct-dismiss">No Thanks</div>').click(function(){
      oGlobalDispatcher.publish('toggle_switch');
      // Analytics tracking
      Cotton.ANALYTICS.dismissSwitch();
    });

    this._$proto_switch.append(
      this._$box.append(
        this._oForm.$(),
        this._$dismiss
      )
    );
  },

  $ : function() {
    return this._$proto_switch;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('escape', this);
    this._oGlobalDispatcher = null;
    this._$dismiss.remove();
    this._$dismiss = null;
    this._oForm.purge();
    this._oForm = null;
    this._$box.remove();
    this._$box = null;
    this._$proto_switch.remove();
    this._$proto_switch = null;
  }
});