module("Cotton.Utils.UrlParser",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("simple url.", function() {
  var urlSimple   = 'http://www.google.com/search?p=dede&q=keyword1+keyword2+keyword3&aq=autre';
  var a = new UrlParser(urlSimple);
  deepEqual(a.keywords,         // result
            ['keyword1', 'keyword2', 'keyword3'], // expected
            'unexpected keywords');
});

test("google search url.", function() {
  var urlComplexe = 'http://www.google.fr/search?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=fr&gs_nf=1&cp=10&gs_id=3n&xhr=t&q=jennifer+aniston&pq=tets&pf=p&sclient=psy-ab&site=webhp&source=hp&pbx=1&oq=jennifer+a&aq=0&aqi=g4&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=6fc8c6804cede81f&ix=seb&ion=1&biw=1438&bih=727';
  var b = new UrlParser(urlComplexe);

  deepEqual(b.keywords,
            ['jennifer', 'aniston'],
            'unexpected keywords');
});


test("google webhp url.", function() {
  var urlComplexe = 'http://www.google.fr/webhp?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=fr&gs_nf=1&cp=10&gs_id=3n&xhr=t&q=jennifer+aniston&pq=tets&pf=p&sclient=psy-ab&site=webhp&source=hp&pbx=1&oq=jennifer+a&aq=0&aqi=g4&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=6fc8c6804cede81f&ix=seb&ion=1&biw=1438&bih=727';
  var b = new UrlParser(urlComplexe);

  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.keywords,
            undefined,
            'unexpected keywords');
});

test("service google.", function() {
  var urlComplexe = 'https://www.google.fr/search?q=vin+de+garde&aq=f&oq=vin+de&aqs=chrome.0.59j57j0j60j0j62.1357j0&sourceid=chrome&ie=UTF-8';
  var b = new UrlParser(urlComplexe);

  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.service,
            'google',
            'wrong service');
});

test("service wikipedia.", function() {
  var urlComplexe = 'http://en.wikipedia.org/wiki/Domain_Name_System';
  var b = new UrlParser(urlComplexe);

  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.service,
            'wikipedia',
            'wrong service');
});
