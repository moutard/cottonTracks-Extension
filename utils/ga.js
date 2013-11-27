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

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(ga, script);
  },

  // Track an event with _gaq.push(['_trackEvent', 'category', 'action', 'opt_label',
  // 'opt_int_value', 'opt_bool_noninteraction']);

  // monitor installs
  install : function(sVersion) {
    _gaq.push(['_trackEvent', 'users', 'install', sVersion]);
  },

  // monitor updates
  update : function(sVersion) {
    _gaq.push(['_trackEvent', 'users', 'update', sVersion]);
  },

  // install duration
  installTime : function(iDuration) {
    _gaq.push(['_trackEvent', 'performance', 'install_time', 'install', iDuration]);
  },

  // new historyItems indexed
  newHistoryItem : function(iCount) {
    var iItemCount = iCount || 1;
    var sCreationPhase = (iCount) ? 'install' : 'browsing';
    _gaq.push(['_trackEvent', 'data', 'new_item', sCreationPhase, iItemCount]);
  },

  // new visitItem
  newVisitItem : function(iCount) {
    var iVisitCount = iCount || 1;
    var sCreationPhase = (iCount) ? 'install' : 'browsing';
    _gaq.push(['_trackEvent', 'data', 'new_visit', sCreationPhase, iVisitCount]);
  },

  // new Story Created
  newStory : function(iCount) {
    var iStoryCount = iCount || 1;
    var sCreationPhase = (iCount) ? 'install' : 'browsing';
    _gaq.push(['_trackEvent', 'data', 'new_story', sCreationPhase, iStoryCount]);
  },

  // navigation
  openLightyear : function(sEntryPoint) {
    // sEntryPoint is very likely to be browserAction.
    // we will compare it to 'any', triggered every time, to see if people
    // use another way sometimes (such as refresh page).
    _gaq.push(['_trackEvent', 'navigation', 'open_lightyear', sEntryPoint]);
  },

  openManager : function(bPopstate) {
    // bPopstate indicates if the manager has been reached through navigation
    // (browser prev/next, or prev/next arrows)
    // or from the home button
    var sEntryPoint = (bPopstate) ? 'prev_next' : 'home_button';
    _gaq.push(['_trackEvent', 'navigation', 'open_manager', sEntryPoint]);
  },

  navigate : function(sTargetPage) {
    _gaq.push(['_trackEvent', 'navigation', 'change_page', sTargetPage]);
  },

  depth : function(iDepth) {
    _gaq.push(['_trackEvent', 'navigation', 'depth', iDepth]);
  },

  // Cards tracking
  revisitPage : function(sSource) {
    // sSource is the type of the card if it is a card, or preview_link if from the cover
    _gaq.push(['_trackEvent', 'card', 'revisit_card', sSource]);
  },

  deleteCard : function(sCardType) {
    _gaq.push(['_trackEvent', 'card', 'delete_card', sCardType]);
  },

  playVideo : function(sVideoProvider) {
    _gaq.push(['_trackEvent', 'card', 'play_video', sVideoProvider]);
  },

  fetchPool : function(iPoolItems) {
    _gaq.push(['_trackEvent', 'card', 'fetch_pool', '', iPoolItems]);
  },

  addCard : function() {
    _gaq.push(['_trackEvent', 'card', 'add_card']);
  },

  shareCard : function(sMedium) {
    _gaq.push(['_trackEvent', 'card', 'share_card', sMedium]);
  },

  // UIstory tracking.
  openStory : function(sSource) {
    _gaq.push(['_trackEvent', 'story', 'open_story', sSource]);
  },

  deleteStory : function() {
    _gaq.push(['_trackEvent', 'story', 'delete_story']);
  },

  favoriteStory : function(sSource) {
    _gaq.push(['_trackEvent', 'story', 'favorite_story', sSource]);
  },

  unfavoriteStory : function(sSource) {
    _gaq.push(['_trackEvent', 'story', 'unfavorite_story', sSource]);
  },

  storyContext : function(sContext) {
    _gaq.push(['_trackEvent', 'story', 'story_context', sContext]);
  },

  editTitle : function(sContext) {
    _gaq.push(['_trackEvent', 'story', 'edit_title', sContext]);
  },

  // related tracking
  showRelated : function(iRelated) {
    _gaq.push(['_trackEvent', 'related', 'show_related', iRelated]);
  },

  hideRelated : function() {
    _gaq.push(['_trackEvent', 'related', 'hide_related']);
  },

  // settings
  openSettings : function() {
    _gaq.push(['_trackEvent', 'settings', 'open_settings']);
  },

  closeSettings : function(sCloseMethod) {
    _gaq.push(['_trackEvent', 'settings', 'close_settings', sCloseMethod]);
  },

  feedback : function(sSuccessFailure) {
    _gaq.push(['_trackEvent', 'settings', 'feedback', sSuccessFailure]);
  },

  rateUs : function() {
    _gaq.push(['_trackEvent', 'settings', 'rate_us', Cotton.Core.Browser()]);
  },

  // Search.
  searchStories : function(sTriggerMethod) {
    _gaq.push(['_trackEvent', 'search', 'search_stories', sTriggerMethod]);
  }

});

Cotton.ANALYTICS = new Cotton.Analytics();