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
    if (localStorage['ct-cohort']) {
      _gaq.push(['_trackEvent', 'cohort', localStorage['ct-cohort']]);
    } else if (localStorage['cohort']) {
      // transition between cohort to ct-cohort.
      // remove it after a few updates, when most of the users will be updated.
      localStorage.setItem('ct-cohort', localStorage['cohort']);
      localStorage.removeItem('cohort');
      _gaq.push(['_trackEvent', 'cohort', localStorage['ct-cohort']]);
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
    if (!sCohort){
      var date = new Date();
      var month = date.getMonth() + 1;
      localStorage.setItem('ct-cohort', month + "/" + date.getFullYear());
      var sCohort = month + "/" + date.getFullYear();
    }
    _gaq.push(['_trackEvent', 'cohort', 'setCohort', sCohort]);
  },

  // monitor installs
  install : function(sVersion) {
    _gaq.push(['_trackEvent', 'version', 'install', sVersion]);
  },

  // monitor updates
  update : function(sVersion) {
    _gaq.push(['_trackEvent', 'version', 'update', sVersion]);
  },

  // number of indexed historyItems at install
  historyItemsInstallCount : function(iItemsCount) {
    _gaq.push(['_trackEvent', 'historyItem', 'new_item', 'install', iItemsCount]);
  },

  // number of indexed visitItems at install
  visitItemsInstallCount : function(iItemsCount) {
    _gaq.push(['_trackEvent', 'historyItem', 'new_visit', 'install', iItemsCount]);
  },

  // historyItems tracking
  newHistoryItem : function() {
    _gaq.push(['_trackEvent', 'historyItem', 'new_item', 'browsing', 1]);
  },

  // visitItems tracking
  newVisitItem : function() {
    _gaq.push(['_trackEvent', 'historyItem', 'new_visit', 'browsing', 1]);
  },

  // Story tracking
  storyAvailable : function(sSource) {
    _gaq.push(['_trackEvent', 'story', 'enabled', sSource]);
  },

  showLightyear : function() {
    _gaq.push(['_trackEvent', 'lightyear', 'open', 'browserAction']);
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
  },

  //navigation in the UI
  popState : function(sLandingPageType) {
    _gaq.push(['_trackEvent', 'navigation', 'back_forward', sLandingPageType]);
  }

});

Cotton.ANALYTICS = new Cotton.Analytics();