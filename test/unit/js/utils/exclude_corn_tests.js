module("Cotton.Utils.ExcludeCorn",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("CornHash.", function() {

  deepEqual(Cotton.Utils.CornHash("abc"), "bcd");
  deepEqual(Cotton.Utils.CornHash("xyz"), "yz{");
  deepEqual(Cotton.Utils.CornHash("|}"), "}~");
});

test("CornUnHash.", function() {

  deepEqual(Cotton.Utils.CornUnHash("abc"), "`ab");
  deepEqual(Cotton.Utils.CornUnHash("xyz"), "wxy");
  deepEqual(Cotton.Utils.CornUnHash("|}"), "{|");
});

test("CornHashAllKeywords.", function() {
  var lKeywords = ["porn", "sex", "blowjob", "xxx", "bangbros", "whores", "pussy"];
  var lHostname = ["youporn", "pornhub", "redtube", "perfectgirls", "xnxx",
    "xvideos", "youjizz", "coqnu", "pinkdino", "booloo", "etuber", "tubepommos",
    "adultfriendfinder", "xhamster", "cliphunter", "xtube", "alotporn", "pornative",
    "tube8", "hondavis", "shufuni", "yuvutu", "spankwire", "tnaflix", "efukt",
    "voyeurweb", "wide6", "watchersweb", "maxporn", "vulvatube", "moviegator",
    "mofosex", "yazum", "empflix", "megaporno", "pron", "porncor", "lubetube",
    "vid2c", "sexbot", "clearclips", "totalporn", "tiavastube", "pornative",
    "avhere", "theporncore", "moviesand", "keezmovies", "free2peek",
    "4cam", "myfreecams", "cam4", "cheggit", "puretna", "teensnow", "drtuber",
    "sticking", "collegewhores", "wankerhut", "girlsintube", "tubeguide",
    "skimtube", "bangbull", "freudbox", "sublimemovies", "snatchncrack",
    "koostube", "apetube", "butsnow", "x3xtube", "scafy", "gonzomovie",
    "mastishare"];
  var lHashKeywords = [];
  var lHashHostname = [];
  for (var i = 0, iLength = lKeywords.length; i < iLength; i++) {
    lHashKeywords.push(Cotton.Utils.CornHash(lKeywords[i]));
  }

  for (var i = 0, iLength = lKeywords.length; i < iLength; i++) {
    deepEqual(Cotton.Utils.CornUnHash(lHashKeywords[i]), lKeywords[i]);
  }

  for (var i = 0, iLength = lHostname.length; i < iLength; i++) {
    lHashHostname.push(Cotton.Utils.CornHash(lHostname[i]));
  }
  console.log(lHashKeywords);
  console.log(lHashHostname);
});

test("isCorn.", function() {
  var oCornExcluder = new Cotton.Utils.CornExcluder();
  equal(oCornExcluder.isCorn("http://www.youporn.com/channels/", "youporn.com"), true);
  equal(oCornExcluder.isCorn("http://www.pornhub.com/channels/", "pornhub.com"), true);
  equal(oCornExcluder.isCorn("http://www.sexalive.com/channels/", "sexalive.com"), true);
});
