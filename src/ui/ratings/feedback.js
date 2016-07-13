"use strict";

Cotton.UI.Ratings.Feedback = Class.extend({

  /**
   * {DOM} feedback html from
   */
  _$feedback : null,

  /**
   * {DOM} label for the textarea
   */
  _$label : null,

  /**
   * {DOM} text field for the user
   */
  _$formfield : null,

  /**
   * {DOM} submit button
   */
  _$submit : null,

  /**
   * {DOM} container for the status message for confirming the user that the message was sent.
   */
  _$statusbox : null,

  /**
   * {DOM} sending message
   */
  _$sending : null,

  /**
   * {DOM} success message
   */
  _$succes : null,

  /**
   * {DOM} error message
   */
  _$error : null,

  /**
   * {DOM} [part of _$error] "Uh Oh, something went wrong :(<br/>Please"
   */
  _$oups : null,

  /**
   * {DOM} [part of _$error] "try again" button, retry to publish the feedback
   */
  _$retry : null,

  /**
   * {DOM} [part of _$error] ", or consider using "
   */
  _$alternative : null,

  /**
   * {DOM} [part of _$error] mailto link for contact@cottontracks.com
   */
  _$mail : null,

  init : function() {
    var self = this;

    // we use a google form, the results go directly in a spreadsheet on drive
    // plus a google apps script that sends an email at every new submission of the form
    this._$feedback = $('<form class="ct-feedback" '
      +'action="https://docs.google.com/forms/d/1fCf6meF4aBaVjxjFq1uzK24qNibjHuYTRbnwYzihs6U/formResponse" '
      +'method="POST" id="ss-form" target="_self"></form>');

    this._$label = $('<label class="ct-feedback_label" for="entry_1105692513">Leave us your feedback or ask us a question</label>');
    this._$formfield = $('<textarea name="entry.1105692513" class="ct-feedback_form" id="entry_1105692513" dir="auto" '
      +'placeholder="Help us build a better product by sending your feedback anonymously.'
      +' You can also ask us any question."></textarea>');
    this._$email = $('<input type="text" name="entry.261473464" class="ct-feedback_email_source" id="entry_261473464" dir="auto"'
      + 'placeholder="email (optional) for us to answer">');
    this._$submit = $('<input class="ct-feedback_submit disabled" type="submit" name="submit" value="SEND" id="ct-feedback_submit">');

    // _$statusbox contains sending, success or error
    this._$statusbox = $('<div class="ct-feedback_statusbox"></div>');
    this._$sending = $('<span>Sending...</span>');
    this._$success = $('<span>Your message was succesfully sent. Thanks a lot for your feedback!</span>');

    // error message, split in 4 parts
    this._$oups = $('<span>Uh Oh, something went wrong :(<br/>Please </span>');
    // click to retry if error
    this._$retry = $('<span class="ct-feedback_retry">try again</span>').click(function(){
      self.retry();
    });
    this._$alternative = $('<span>, or consider using </span>');
    // mailto link
    this._$mail = $('<a class="ct-feedback_mail" target="_blank" href="mailto:contact@cottontracks.com">contact@cottontracks.com</a>');
    this._$error = $('<span class="ct-feedback_error"></span>').append(
      this._$oups,
      this._$retry,
      this._$alternative,
      this._$mail
    );

    // show the submit button fully opaque only if some text is written
    this._$formfield.keyup(function(e){
      if ($(this).val() !== "") {
        self._$submit.removeClass('disabled');
      } else {
        self._$submit.addClass('disabled');
      }
    });

    this._$feedback.append(
      self._$label,
      self._$formfield,
      self._$email,
      self._$submit
    );

    // Form submission
    this._$feedback.submit(function(e){
      if (self._$formfield.val() !== ""){
        // append the status box
        self._$feedback.append(self._$statusbox);
        // launch the sending status
        self.pending(0);
        // submit the form via ajax with the content of the form
        $.post(self._$feedback.attr('action'), self._$feedback.serialize(), function(response){
        }).success(function(response){
          // analytics tracking.
          Cotton.ANALYTICS.feedback('success');
          // success
          self.success();
        }).fail(function(response) {
          // analytics tracking.
          Cotton.ANALYTICS.feedback('failure');
          // failure
          self.failure();
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
    return this._$feedback;
  },

  pending : function(iNumberOfCycles) {
    var self = this;
    self._$statusbox.append(self._$sending);
    // wait 2 seconds, then check if there was an answer from the server.
    // repeat every 2 sec until message or 10sec, then throw error message
    setTimeout(function(){
      if (self._bSuccess) {
        self.success();
      } else if (self._bError) {
        self.failure();
      } else if (iNumberOfCycles < 5) {
        iNumberOfCycles++;
        self.pending(iNumberOfCycles)
      } else {
        self.failure();
      }
    }, 2000);
  },

  success : function() {
    var self = this;
    if (this._bSuccess) {
      // the pending function has seen the there was a success and sends here
      // set _bsuccess to false and clear the textfield and disable the submit button
      // in case the user wants to start a new feedback
      this._bSuccess = false;
      this._$formfield.val("");
      this._$email.val("");
      this._$submit.addClass("disabled");
      // append success message and make it disappear after 2 sec
      this._$statusbox.empty().append(self._$success);
      setTimeout(function(){
        self._$statusbox.fadeOut(function(){
          self._$statusbox.empty().detach();
          self._$statusbox.show();
        });
      }, 2000);
    } else {
      // tells the pending function that the request has been successful
      this._bSuccess = true;
    }
  },

  failure : function() {
    var self = this;
    if (this._bError) {
      // the pending function has seen the there was a failure and sends here
      // append the error message that enables to retry or send a mail
      this._$statusbox.empty().append(self._$error);
    } else {
      // tells the pending function that the request has been a failure
      this._bError = true;
    }
  },

  retry : function() {
    var self = this;
    // set the _bSuccess and _bError to false,
    // empty the statusbox
    this._bSuccess = false;
    this._bError = false;
    this._$error.detach();
    // then launch again the pending message and a new ajax submission
    self.pending();
    $.post(self._$feedback.attr('action'), self._$feedback.serialize(), function(response){
    }).success(function(response){
      self.success();
    }).fail(function(response) {
      self.failure();
    });
  },

  feedbackText : function() {
    // used by the parent object when closing the settings page. If the field is empty,
    // the whole setting object is purged.
    // otherwise we keep it and just hide it so that the user can keep editing later
    // his feedback
    return this._$formfield.val();
  },

  purge : function() {
    this._$oups = null;
    this._$retry.unbind('click');
    this._$retry = null;
    this._$alternative = null;
    this._$mail = null;
    this._$error.empty();
    this._$error = null;
    this._$success = null;
    this._$sending = null;
    this._$statusbox.empty();
    this._$statusbox = null;
    this._$submit = null;
    this._$formfield = null;
    this._$email = null;
    this._$label = null;
    this._$feedback.empty();
    this._$feedback = null;
  }

});
