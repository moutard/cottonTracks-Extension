var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

module("Cotton.Utils.ExcludeContainer",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("is tool.", function() {
  var oTool1 = new UrlParser('http://mail.google.com');
  var sTool1 = oTool1.hostname;
  var oTool2 = new UrlParser('https://accounts.google.com');
  var sTool2 = oTool2.hostname;
  var oNotTool = new UrlParser('http://www.lemonde.fr/ref?referrer=https://mail.google.com/mail/u/0/#inbox/13d8886c2c498338');
  var sNotTool = oNotTool.hostname;

  deepEqual(oExcludeContainer.isTool(sTool1), true, 'mail is a tool');
  deepEqual(oExcludeContainer.isTool(sTool2), true, 'https account.google.com is a tool');
  deepEqual(oExcludeContainer.isTool(sNotTool), false, 'lemonde.fr is not a tool');
});

test("is excluded pattern.", function() {
  var sSearchGeneratedPage =
    'https://www.google.com/url?url=http%3A%2F%2Fwww.journaldugeek.com%2F2013%2F03%2F18%2Fgoogle-keep-evernote-made-in-google';
  var sNotSearchGeneratedPage = 'http://www.blogposts.com/ref?referrer=https://www.google.com/url?url=http%3A%2F%2Fwww.journaldugeek.com%2F2013%2F03%2F18%2Fgoogle-keep-evernote-made-in-google';
  var sLocalHost = "http://localhost:8888";
  var sChromeExtension = "chrome-extension://dlemjomhbbkijjhnbndcgglakfcdobjl/lightyear.html";
  var sGoogleCoUk = "https://www.google.co.uk/url";
  var sGoogleCl = "https://www.google.cl/url";
  var sGoogleCom = "https://www.google.com/url";
  var sGoogleComAu = "https://www.google.com.au/url";

  deepEqual(oExcludeContainer.isExcluded(sSearchGeneratedPage), true,
    'searchGeneratedPage is introduced between google and actual search result clicked');
  deepEqual(oExcludeContainer.isExcluded(sNotSearchGeneratedPage), false,
    'a real page indicating that it comes from a searchGeneratedPage');
  deepEqual(oExcludeContainer.isExcluded(sLocalHost), true,
    'localhost');
  deepEqual(oExcludeContainer.isExcluded(sChromeExtension), true,
    'chrome-extension');
  deepEqual(oExcludeContainer.isExcluded(sGoogleCoUk), true,
    'google.co.uk');
  deepEqual(oExcludeContainer.isExcluded(sGoogleCl), true,
    'google.cl');
  deepEqual(oExcludeContainer.isExcluded(sGoogleCom), true,
    'google.com');
  deepEqual(oExcludeContainer.isExcluded(sGoogleComAu), true,
    'google.com.au');
});

test("is https.", function() {
  var sSecurePage1 = 'https://www.vimeo.com';
  var oSecurePage1 = new UrlParser(sSecurePage1);
  var sSecurePage2 = 'https://twitter.com';
  var oSecurePage2 = new UrlParser(sSecurePage2);
  var sUnsecurePage = 'http://www.cottontracks.com';
  var oUnsecurePage = new UrlParser(sUnsecurePage);
  var sLocalHost = 'http://localhost:8888';
  var oLocalHost = new UrlParser(sLocalHost);

  deepEqual(oExcludeContainer.isHttps(oSecurePage1), true, 'it is an https');
  deepEqual(oExcludeContainer.isHttps(oSecurePage2), true, 'it is an https');
  deepEqual(oExcludeContainer.isHttps(oUnsecurePage), false, 'it is not an https');
  deepEqual(oExcludeContainer.isHttps(oLocalHost), false,'it is a localhost');
});

test("is excluded.", function() {
  var sTool1 = 'http://mail.google.com';
  var sTool2 = 'https://accounts.google.com';
  var sNotTool = 'http://www.lemonde.fr/ref?referrer=https://mail.google.com/mail/u/0/#inbox/13d8886c2c498338';
  var sSecurePage1 = 'https://www.vimeo.com';
  var sSecurePage2 = 'https://twitter.com';
  var sUnsecurePage = 'http://www.cottontracks.com';
  var sLocalHost = 'http://localhost:8888';
  var sSearchGeneratedPage =
     'https://www.google.com/url?url=http%3A%2F%2Fwww.journaldugeek.com%2F2013%2F03%2F18%2Fgoogle-keep-evernote-made-in-google';
  var sNotSearchGeneratedPage = 'http://www.blogposts.com/ref?referrer=https://www.google.com/url?url=http%3A%2F%2Fwww.journaldugeek.com%2F2013%2F03%2F18%2Fgoogle-keep-evernote-made-in-google';

  deepEqual(oExcludeContainer.isExcluded(sSecurePage1), true, 'excluded (https)');
  deepEqual(oExcludeContainer.isExcluded(sSecurePage2), true, 'excluded (https)');
  deepEqual(oExcludeContainer.isExcluded(sUnsecurePage), false, 'valid url');
  deepEqual(oExcludeContainer.isExcluded(sLocalHost), true,'localhost');
  deepEqual(oExcludeContainer.isExcluded(sTool1), true, 'tool');
  deepEqual(oExcludeContainer.isExcluded(sTool2), true, 'tool');
  deepEqual(oExcludeContainer.isExcluded(sNotTool), false, 'valid url');
  deepEqual(oExcludeContainer.isExcluded(sSearchGeneratedPage), true,'search generated page');
  deepEqual(oExcludeContainer.isExcluded(sNotSearchGeneratedPage), false,'valid url');
});