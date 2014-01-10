"use strict";

Cotton.UI.Topbar.Path = Class.extend({

  init : function(oGlobalDispatcher) {
    this._$path = $('<div class="ct-topbar_path"></div>');
    this._$library = $('<div class="ct-topbar_path_element">Library</div>').click(function(){
      oGlobalDispatcher.publish('home');
    });
    this._$first = $('<div class="ct-topbar_path_element"></div>').click(function(){
      oGlobalDispatcher.publish('cancel_adder');
    });
    this._$second = $('<div class="ct-topbar_path_element"></div>');

    this._sCheesecakeTitle = "";

    oGlobalDispatcher.subscribe('home', this, function(){
      this.library();
    });

    oGlobalDispatcher.subscribe('open_cheesecake', this, function(dArguments){
      this.first(dArguments["cheesecake"].title());
    });

    oGlobalDispatcher.subscribe('add_more_cards', this, function(){
      this.second();
    });

    oGlobalDispatcher.subscribe('validate_stack', this, function(){
      this.first();
    });

    oGlobalDispatcher.subscribe('cancel_adder', this, function(){
      this.first();
    });

  },

  $ : function() {
    return this._$path;
  },

  library : function() {
    this._$library.detach();
    this._$first.detach();
    this._$second.detach();
    this._$path.append(this._$library);
  },

  first : function(sTitle) {
    var sTitle = sTitle || this._sCheesecakeTitle;
    this.library();
    this._$first.text(sTitle || this._sCheesecakeTitle);
    this._$path.append(this._$first);
    this._sCheesecakeTitle = sTitle;
  },

  second : function() {
    this._$second.detach();
    this._$second.text('Add new cards');
    this._$path.append(this._$second);
  },

});