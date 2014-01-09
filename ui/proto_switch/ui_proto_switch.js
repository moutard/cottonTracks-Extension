"use strict";

Cotton.UI.ProtoSwitch.UIProtoSwitch = Class.extend({

  init : function(oGlobalDispatcher) {
    this._oGlobalDispatcher = oGlobalDispatcher;
    this._$proto_switch = $('<div class="ct-proto_switch"></div>').click(function(e){
      if (e.target === this) {
        oGlobalDispatcher.publish('toggle_switch');
        // Analytics tracking
        Cotton.ANALYTICS.escapeSwitch();
      }
    });

    // Actual proto_switch box.
    this._$box = $('<div class="ct-proto_switch_box"></div>');

    this._$title = $('<div class="ct-switch_box_title">Our new version is in the box</div>');
    this._$subtitle = $('<div class="ct-switch_box_subtitle">Answer 2 questions and become an awesome beta tester!</div>');

    // email form
    this._oForm = new Cotton.UI.ProtoSwitch.Form(oGlobalDispatcher);

    // Exit protoswitch by clicking no_thanks.
    this._$dismiss = $('<div class="ct-dismiss">No Thanks, I will keep this version for now</div>').click(function(){
      oGlobalDispatcher.publish('toggle_switch');
      // Analytics tracking
      Cotton.ANALYTICS.dismissSwitch('no_thanks');
    });

    // Cross for closing the settings page.
    this._$close = $('<div class="ct-close_proto_switch_box"></div>').click(function(){
      oGlobalDispatcher.publish('toggle_switch');
      // Analytics tracking
      Cotton.ANALYTICS.escapeSwitch();
    });

    this._$proto_switch.append(
      this._$box.append(
        this._$title,
        this._$subtitle,
        this._oForm.$(),
        this._$dismiss,
        this._$close
      )
    );
  },

  $ : function() {
    return this._$proto_switch;
  },

  purge : function() {
    this._oGlobalDispatcher.unsubscribe('escape', this);
    this._oGlobalDispatcher = null;
    this._$title.remove();
    this._$title = null;
    this._$subtitle.remove();
    this._$subtitle = null;
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