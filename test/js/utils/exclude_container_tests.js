var oExcludeContainer = new Cotton.Utils.ExcludeContainer();

module("Cotton.Utils.UrlParser",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("is tool.", function() {
  var oTool = new UrlParser('http://mail.google.com');
  var sTool = oTool.hostname;
  var oNotTool = new UrlParser('http://www.lemonde.fr/ref?referrer=https://mail.google.com/mail/u/0/#inbox/13d8886c2c498338');
  var sNotTool = oNotTool.hostname;

  deepEqual(oExcludeContainer.isTool(sTool), true, 'mail is a tool');
  deepEqual(oExcludeContainer.isTool(sNotTool), false, 'lemonde.fr is not a tool');
});

test("is excluded pattern.", function() {
  var sSearchGeneratedPage =
    'https://www.google.com/url?url=http%3A%2F%2Fwww.journaldugeek.com%2F2013%2F03%2F18%2Fgoogle-keep-evernote-made-in-google';
  var sNotSearchGeneratedPage = 'http://www.blogposts.com/ref?referrer=https://www.google.com/url?url=http%3A%2F%2Fwww.journaldugeek.com%2F2013%2F03%2F18%2Fgoogle-keep-evernote-made-in-google';

  deepEqual(oExcludeContainer.isExcluded(sSearchGeneratedPage), true,
    'searchGeneratedPage is introduced between google and actual search result clicked');
  deepEqual(oExcludeContainer.isExcluded(sNotSearchGeneratedPage), false,
    'a real page indicating that it comes from a searchGeneratedPage');
});