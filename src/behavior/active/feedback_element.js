'use strict';

/**
 * @class : FeedbackElement
 *
 * Created by : content_scripts.
 *
 * In charge of displaying feedback only on dev mode.
 */

Cotton.Behavior.Active.FeedbackElement = Class.extend({
  /**
   * A DOM element containing the current estimated reading rate.
   *
   * @type jQuery DOM
   */
  _$feedback : null,

  /**
   * A DOM element containing the current estimated reading rate.
   *
   * @type jQuery DOM
   */
  _$feedback_percentage : null,

  /**
   * A DOM element containing an <img /> supposed to represent the most relevant
   * image on the page.
   *
   * @type jQuery DOM
   */
  _$feedback_best_img : null,

  init : function(){
    // TODO(rmoutard) : put css in the less file.
    if (Cotton.Config.Parameters.bDevMode === true) {

      this._$feedback = $('<div class="feedback">').css({
        position : 'fixed',
        left : 0,
        bottom : 0,
        border : '3px solid #000',
        background : '#fff',
        fontSize : '2em',
        padding : '0.4em'
      });

      this._$feedback_percentage = $('<p class="percentage">');

      this._$feedback_best_img = $('<img class="best_image"/>').css({
        width : 50,
        height : 50
      });

      $('body').append(
        this._$feedback.append(
          this._$feedback_percentage,
          this._$feedback_best_img
        )
      );
    }

  },

  setPercentage : function(iPercentage){
    if(this._$feedback){
       this._$feedback_percentage.text(iPercentage);
    }
  },

  setBestImage : function(sBestImg){
    if(this._$feedback){
      this._$feedback_best_img.attr('src', sBestImg);
    }
  },

  update : function(oReadingRater){
    var self = this;
    if(this._feedback){
      this.setBestImage(oReadingRater.readingRate());
    }
  },

  stop : function(){
    if(this._$feedback_percentage){
      this._$feedback_percentage.css("color", "red");
    }
  },

  start : function(){
    if(this._$feedback_percentage){
      this._$feedback_percentage.css("color", "black");
    }
  },
});

