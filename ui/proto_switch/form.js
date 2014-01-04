"use strict";

Cotton.UI.ProtoSwitch.Form = Class.extend({

  init : function(oGlobalDispatcher) {
    var self = this;

    // we use a google form, the results go directly in a spreadsheet on drive
    // plus a google apps script that sends an email at every new submission of the form
    this._$form = $('<form class="ct-form" '
      +'action="https://docs.google.com/forms/d/1SqErnbcIVrm49udpm3ttKdyR-c9yZSLQnw7vXE1rdTc/formResponse" '
      +'method="POST" id="ss-form" target="_self"></form>');

    this._$label = $('<label class="ct-form_label" for="entry_1835666030"></label>');
    this._$job = $('<select name="entry.1835666030" id="entry_1835666030" aria-label="You are:  ">'
    +'<option value="">You are...</option>'
    +'<option value="Writer / Journalist">Writer / Journalist</option>'
    +'<option value="Consultant">Consultant</option>'
    +'<option value="PR">PR</option>'
    +'<option value="Developper">Developper</option>'
    +'<option value="Community Manager">Community Manager</option>'
    +'<option value="Researcher">Researcher</option>'
    +'<option value="Teacher">Teacher</option>'
    +'<option value="Medical Professional">Medical Professional</option>'
    +'<option value="Recruiter">Recruiter</option>'
    +'<option value="Analyst">Analyst</option>'
    +'<option value="Student">Student</option>'
    +'<option value="Other">Other</option></select>');
    this._$email = $('<input type="email" name="entry.229712282" value="" class="ss-q-short"'
    +'id="entry_229712282" dir="auto"'
    +'aria-label="please leave us an email to ask about your feedback (no commercial use ever!)">');
    this._$submit = $('<input class="ct-form_submit disabled" type="submit" name="submit" value="Try it now" id="ct-form_submit">');

    // show the submit button fully opaque only if some text is written
    this._$email.keyup(function(e){
      if ($(this).val() !== "") {
        self._$submit.removeClass('disabled');
      } else {
        self._$submit.addClass('disabled');
      }
    });

    this._$form.append(
      self._$label,
      self._$job,
      self._$email,
      self._$submit
    );

    // Form submission
    this._$form.submit(function(e){
      if (self._$email.val() !== ""){
        // submit the form via ajax with the content of the form
        $.post(self._$form.attr('action'), self._$form.serialize(), function(response){
          oGlobalDispatcher.publish('switch_to_proto');
        });
      } else {
        // do not submit the form, there was nothing in it. Simulates a disabled button
      }
      // block the html submission of the form, not to be redirected
      // to google form confirmation page
      return false;
    });
  },

  $ : function() {
    return this._$form;
  },

  purge : function() {
    this._$label.remove();
    this._$label = null;
    this._$job.remove();
    this._$job = null;
    this._$email.remove();
    this._$email = null;
    this._$submit.remove();
    this._$submit = null;
    this._$form.remove();
    this._$form = null;
  }
});