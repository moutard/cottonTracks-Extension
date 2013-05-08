'use strict';

module(
  'Cotton.Behavior.Passive.Parser',
  {
    setup : function() {

    },
    teardown : function() {
      // runs after each test
    }
  }
);

// Shortcut for extension messages
var oMessaging = chrome.extension.onMessage;
// Results container object
var oAllResults = [];

// List of web pages to test
var lWebPagesToTest = [
  'arstechnica_html5',
  'bbc_gchq',
  'bbc_nhs_reform',
  'huffingtonpost_sarkozy',
  'jeux_video_streetfighter',
  'nyt_germany_content_profits',
  'nyt_wilderness',
  'tc_getty',
  'tnw_mexico',
  'wiki_aniston',
  'wikipedia_colors',
  '24horas_candidatos',
  'veronica_belmont',
  'about_veronica',
  'clubic_numericable',
  'linkedin_mikitani',
  'glam_sunnies',
  'chrome_blog_washington',
  'el_mundo_sindicatos',
  'la_times_stockton',
  'internship_in_la',
  'paris_business_college',
  'nightstalker_wife',
  'basket-utah',
  'ars-bitcoin',
  'cracked-superpowers',
  'pando-bandsintown',
  'sofoot-gourcuff',
  'ign-injustice',
  'illinois-jobs',
  'nextnewdeal-reinhart',
  'swombat-bomb',
  'github-logo',
  'memcache-service',
  'austinlouden-ios',
  'techcrunch-aa',
  'zdnet-parallella',
  'xamarin-testcloud',
  'stackexchange-adjective'
];

// Set cache to false so the tests can see JSON files changes
$.ajaxSetup({ cache: false });

// Get the absolute path to the project.
$.getJSON('../../data/absolute_path_to_extension_folder.json',
  function(sOwnPath) {
  // For each page in test/data/webpage that is listed in lWebPagesToTest
  for (var i = 0, len = lWebPagesToTest.length; i < len; i++) {
    // Get test data
    $.getJSON('../../data/web_pages/' + lWebPagesToTest[i]
      + '/test_data.json', function(oTestData) {
      // Define expected data
      var lExpectedParagraphs = oTestData['expected'];
      var lMeaningfulParagraphs;
      var sExpectedImage = oTestData['best_image'];
      var sWebPageId = oTestData['id'];
      var sAbsPath = 'file://' + sOwnPath + oTestData['path'];
      // Results object for the web_page currently being tested
      var oResults = {
        'id': sWebPageId,
        'path': sAbsPath,
        'time': { 'start': null, 'end': null },
        'expected': lExpectedParagraphs.length,
        'meaningful': null,
        'image': null,
        'missings': 0,
        'false_positives': 0
      };

      // Test expected paragraphs
      asyncTest('Missings' + ': ' + sWebPageId, function() {
        // Load web page on new tab
        chrome.tabs.create({
            'url' : sAbsPath,
            'active' : false
          }, function(tab) {
          // Listen for parser start
          oMessaging.addListener(function(message, sender, sendResponse) {
            if (message.parsing === 'start' && sender['tab']['id'] === tab['id']) {
              oResults['time']['start'] = performance.now();
            }
          });
          // Listen for parsing results
          oMessaging.addListener(function(message, sender, sendResponse) {
            // If the message have parsing results and comes from current tab
            if (message.parsing === 'end' && sender['tab']['id']=== tab['id']) {
              // Measure elapsed time
              oResults['time']['end'] = performance.now();
              // Define meaningful paragraphs
              lMeaningfulParagraphs = message['results']['meaningful'];
              oResults['meaningful'] = lMeaningfulParagraphs.length;
              // Define selected image
              oResults['image'] = message['results']['bestImage'];
              // The assertions
              // Check lists are not empty
              ok(lExpectedParagraphs.length, 'Expected paragraphs'
                + ' list should have at least one member');
              ok(lMeaningfulParagraphs.length, 'Meaningful paragraphs'
                + ' list should have at least one member');
              // Assert each member of lExpectedParagraphs is also memeber of
              // lMeaningfulParagraphs
              for (var i = 0, len = lExpectedParagraphs.length; i < len; i++) {
                var sParagraph = lExpectedParagraphs[i];
                var bPresent = (lMeaningfulParagraphs.indexOf(sParagraph) > -1);
                if (!bPresent) {
                  oResults['missings'] += 1;
                }
                ok(bPresent, 'Should be meaningful' + ': ' + sParagraph);
              }
              // Assert each member of lMeaningfulParagraphs is also memeber of
              // lExpectedParagraphs
              for (var i = 0, len = lMeaningfulParagraphs.length; i < len; i++) {
                var sParagraph = lMeaningfulParagraphs[i];
                var bPresent = (lExpectedParagraphs.indexOf(sParagraph) > -1);
                if (!bPresent) {
                  oResults['false_positives'] += 1;
                }
                ok(bPresent, 'Should be expected' + ': ' + sParagraph);
              }
              // Assert image url
              var sExpectedImageName = sExpectedImage.split('/');
              sExpectedImageName = sExpectedImageName[sExpectedImageName.length - 1];
              // The saved web pages have lowercased file names and hrefs
              sExpectedImageName = sExpectedImageName.toLowerCase();
              var sResultImageName = oResults['image'].split('/');
              sResultImageName = sResultImageName[sResultImageName.length - 1];
              var bEqual = (sExpectedImageName == sResultImageName);
              deepEqual(sResultImageName, sExpectedImageName, 'Should pick correct image');
              oResults['image'] = bEqual;
              // Append current results to all results
              oAllResults.push(oResults);
              chrome.tabs.remove(tab['id']);
              start();
            }
          });
        });
      });
    });
  }
  // Custom event to notify the dashboard
  var oResultsEvent = new CustomEvent('results', {
    detail: oAllResults
  });

  var oAllResultsInterval = setInterval(function() {
    if (oAllResults.length === lWebPagesToTest.length) {
      clearInterval(oAllResultsInterval);
      // Open new window with all results
      var oResultsWindow = window.open('dashboard.html');
      // Trigger 'results' event on new window onload
      oResultsWindow.onload = function() {
        oResultsWindow.window.dispatchEvent(oResultsEvent);
      };
    }
  }, 500);
}).error(function() {
  alert("You must have a 'absolute_path_to_extension_folder.json' file "
        + "with the absolute path to your extension folder."
        + "For example: \"/Users/drojas/Code/ct/extension/\"");
});