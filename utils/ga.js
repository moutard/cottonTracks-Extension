'use strict';

var _gaq = _gaq || [];

Cotton.Analytics = Class.extend({

  init : function() {
    this._gaq = _gaq || [];

    if (Cotton.Config.Parameters.bAnalytics === true) {
      _gaq.push(['_setAccount', 'UA-30134257-1']);
    } else {
      _gaq.push(['_setAccount', 'UA-30134257-3']);
    }
    _gaq.push(['_trackPageview']);
    if (localStorage['cohort']) {
      _gaq.push(['_trackEvent', 'cohort', localStorage['cohort']]);
    }

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(ga, script);
  },

  // Track an event with _gaq.push(['_trackEvent', 'category', 'action', 'opt_label',
  // 'opt_int_value', 'opt_bool_noninteraction']);

  // to track number of people in a cohort
  setCohort : function(sCohort) {
    _gaq.push(['_trackEvent', 'cohort', 'setCohort', sCohort]);
  },

  // monitor updates
  update : function(sVersion) {
    _gaq.push(['_trackEvent', 'version', 'update', sVersion]);
  },

  // items tracking
  visitHistoryItem : function() {
    _gaq.push(['_trackEvent', 'historyItem', 'new_visit']);
  },

  // Story tracking
  storyAvailable : function(sSource) {
    _gaq.push(['_trackEvent', 'story', 'enabled', sSource]);
  },

  showLightyear : function() {
    _gaq.push(['_trackEvent', 'lightyear', 'open', 'browserAction']);
  },

  backToPage : function(sLeaveMedium) {
    _gaq.push(['_trackEvent', 'lightyear', 'leave', sLeaveMedium]);
  },

  filter : function(sFilterType) {
    _gaq.push(['_trackEvent', 'story', 'filter', sFilterType]);
  },

  scrollStory : function() {
    _gaq.push(['_trackEvent', 'story', 'scroll']);
   },

  editStoryTitle : function(sRenameMedium) {
    _gaq.push(['_trackEvent', 'story', 'edit_title', sRenameMedium]);
  },

  deleteStory : function() {
    _gaq.push(['_trackEvent', 'story', 'delete_story']);
  },

  // Item tracking
  openItem : function(sItemType, sTrigger) {
    _gaq.push(['_trackEvent', sItemType, 'open', sTrigger]);
  },

  deleteItem : function(sItemType) {
    _gaq.push(['_trackEvent', sItemType, 'delete', 'toolbox']);
  },

  getContent : function() {
    _gaq.push(['_trackEvent', 'article', 'getContent', 'toolbox']);
  },

  // Reader Tracking
  expand : function() {
    _gaq.push(['_trackEvent', 'article', 'expand', 'toolbox']);
  },

  collapse : function() {
    _gaq.push(['_trackEvent', 'article', 'collapse', 'toolbox']);
  },

  scrollReader : function() {
    _gaq.push(['_trackEvent', 'article', 'scroll', 'reader']);
  },

  //related stories and search
  relatedStories : function() {
    _gaq.push(['_trackEvent', 'related', 'open_panel', 'related_toggler']);
  },

  backToStory : function() {
    _gaq.push(['_trackEvent', 'related', 'back_to_story', 'related_toggler']);
  },

  searchStories : function(sSearchPlace) {
    _gaq.push(['_trackEvent', 'related', 'search', sSearchPlace]);
  },

  enterStory : function() {
    _gaq.push(['_trackEvent', 'story', 'enter_story']);
  }

});

Cotton.ANALYTICS = new Cotton.Analytics();