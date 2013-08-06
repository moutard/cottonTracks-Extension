'use strict';
module("Cotton.Algo.Tools.extractWordsFromUrlPathname", {});

test("tricky extract words from url - codeacademy. ", function() {
  var sUrl = "http://www.codecademy.com/courses/javascript-beginner-en-6LzGd/2#!/exercises/0";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl.pathname),
    ['courses', 'javascript', 'beginner']);

});

/**
 * This should be an add. So don't very important to miss words.
 */
test("tricky extract words from url - codeacademy. ", function() {
  var sUrl = "http://trc.taboola.com/venturebeat/log/3/click?pi=%2F2007%2F01%2F18%2Fused-textbook-site-chegg-hits-nerve&ri=c8c3c67ecd3b82766274bf8bbe45e635&sd=v1_bc00624db17ab069265579c0afa05a3b_a5913c64-5f01-4265-a054-411a84401ede_1356964190_1356964190&ui=a5913c64-5f01-4265-a054-411a84401ede&it=video&ii=3698492815768696719&pt=text&li=rbox-t2v&redir=%20http%3A%2F%2Fwww.businessweek.com%2Farticles%2F2012-12-04%2Fmba-q-and-a-the-new-czar-of-b-school-accreditation%23r%3Drss%0A%20%20%20%20%20%20%3Fcampaign_id%3Dbw.bs.taboola&p=businessweek-sc&r=68";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl.pathname),
    ['venturebeat', 'log', 'click']);
});

/**
 *
 */
test("tricky extract words from url - shorten url. ", function() {
  var sUrl = "http://t.co/qLRUgZw0";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl.pathname),
    []);
});

test("tricky extract words from url - localhost. ", function() {
  var sUrl = "http://127.0.0.1:8000/";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    []);
});

test("tricky extract words from url - mbostock. ", function() {
  var sUrl = "http://mbostock.github.com/d3/talk/20111116/airports.html";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['talk', 'airports']);
});

test("tricky extract words from url - branch. ", function() {
  var sUrl = "http://branch.com/b/workless-a-classy-html5-css3-framework";
  var oUrl = new UrlParser(sUrl);
  // Because extractWordsFromUrlPathname use StrongFilter so it only authorize
  // words without numbers. That's why "html5" and "css3" are remove by the
  // filter.
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['workless', 'classy', 'framework']);
});

test("tricky extract words from url - nodejs. ", function() {
  var sUrl = "http://mrdanadams.com/2012/node-js-paas-hosting-services/#.UOYcQInjnqI";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['node', 'paas', 'hosting', 'services']);
});

/**
 * Seems to be an add too.
 */
test("tricky extract words from url - outbrain. ", function() {
  var sUrl = "http://traffic.outbrain.com/network/redir?key=6b6327587e7b0d55c1a6994739f31d2a&rdid=439834122&type=DYLD_d/RF_ny&in-site=true&idx=2&req_id=1310cd4eb93af0edfd07a58c5a878aec&agent=blog_JS_rec&recMode=11&reqType=1&wid=100&imgType=2&refPub=2030&prs=true&scp=false";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['network', 'redir']);
});

test("tricky extract words from url - ebooks. ", function() {
  var sUrl = "http://ebooks.narotama.ac.id/files/Google%20and%20the%20Law;%20Empirical%20Approaches%20to%20Legal%20Aspects%20of%20Knowledge-Economy%20Business%20Models/Chapter%209%20Google%20Chrome%20and%20Android;%20Legal%20Aspects%20of%20Open%20Source%20Software.pdf";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['files', 'google', 'law', 'empirical', 'approaches', 'legal',
      'aspects', 'knowledge', 'economy', 'business', 'models', 'chapter',
      'google', 'chrome', 'android', 'legal', 'aspects', 'open', 'source',
      'software'
    ]);
});

test("tricky extract words from url - emlab. ", function() {
  var sUrl = "http://emlab.berkeley.edu/wp/mcfadden0204/browser120104.pdf";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['mcfadden', 'browser']);
});

test("tricky extract words from url - jeux video", function() {
  var sUrl = "http://www.jeuxvideo.com/forums/1-19348-965996-1-0-1-0-apprendre-le-forgeage.htm";
  var oUrl = new UrlParser(sUrl);
  deepEqual(Cotton.Algo.Tools.extractWordsFromUrlPathname(oUrl['pathname']),
    ['forums', 'apprendre', 'forgeage']);
});



