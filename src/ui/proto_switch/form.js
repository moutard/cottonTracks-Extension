"use strict";

Cotton.UI.ProtoSwitch.Form = Class.extend({

  init : function(oGlobalDispatcher) {
    var self = this;

    // we use a google form, the results go directly in a spreadsheet on drive
    // plus a google apps script that sends an email at every new submission of the form
    this._$form = $('<form class="ct-form" '
      +'action="https://docs.google.com/forms/d/1SqErnbcIVrm49udpm3ttKdyR-c9yZSLQnw7vXE1rdTc/formResponse" '
      +'method="POST" id="ss-form" target="_self"></form>');

    this._$joblabel = $('<label class="ct-form_label" for="entry_1835666030">I am a:</label>');
    this._$job = $('<select name="entry.1835666030" class="ct-form_job" id="entry_1835666030">'
    +'<option value="">Pick the one that fits best</option>'
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
    this._$emaillabel = $('<label class="ct-form_label" for="entry_229712282">My email is: (no commercial use - for feedback only)</label>');
    this._$email = $('<input type="email" name="entry.229712282" value="" class="ct-form_email ss-q-short"'
    +'id="entry_229712282" dir="auto" placeholder="awesome.betatester@example.com">');
    this._$submit = $('<input class="ct-form_submit disabled" type="submit" name="submit" value="Please answer the 2 questions to validate" id="ct-form_submit">');

    this._$privacy = $('<a class="ct-switch_box_privacy" href="http://www.cottontracks.com/privacy.html" target="_blank">Read our privacy policy here</a>');

    this._$job.change(function() {
      if ($(this).val() !== "") {
        $(this).addClass("ct-selected");
      } else {
        $(this).removeClass("ct-selected");
      }
    }),

    this._$email.bind('input', function() {
      if ($(this).val() !== "") {
        $(this).addClass("ct-selected");
      } else {
        $(this).removeClass("ct-selected");
      }
    }),

    // show the submit button fully opaque only if some text is written
    this._$email.keyup(function(e){
      if ($(this).val() !== "") {
        self._$submit.removeClass('disabled').val('I\'m ready to be a beta tester');
      } else {
        self._$submit.addClass('disabled').val('Please answer the 2 questions to validate');
      }
    });

    this._$form.append(
      this._$joblabel,
      this._$job,
      this._$emaillabel,
      this._$email,
      this._$privacy,
      this._$submit
    );

    // Form submission
    this._$form.submit(function(e){
      if (self._$email.val() !== ""){
        // submit the form via ajax with the content of the form
        $.post(self._$form.attr('action'), self._$form.serialize(), function(response){
          // Analytics tracking
          Cotton.ANALYTICS.validateSwitch();

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
    this._$privacy.remove();
    this._$privacy = null;
    this._$joblabel.remove();
    this._$joblabel = null;
    this._$job.remove();
    this._$job = null;
    this._$emaillabel.remove();
    this._$emaillabel = null;
    this._$email.remove();
    this._$email = null;
    this._$submit.remove();
    this._$submit = null;
    this._$form.remove();
    this._$form = null;
  }
});