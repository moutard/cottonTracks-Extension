module("Parse Url",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test("Parse Simple Url", function() {
  var urlSimple   = 'http://www.google.com/?p=dede&q=keyword1+keyword2+keyword3&aq=autre';
  var urlComplexe = 'http://www.google.fr/webhp?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=fr&gs_nf=1&cp=10&gs_id=3n&xhr=t&q=jennifer+aniston&pq=tets&pf=p&sclient=psy-ab&site=webhp&source=hp&pbx=1&oq=jennifer+a&aq=0&aqi=g4&aql=&gs_sm=&gs_upl=&bav=on.2,or.r_gc.r_pw.r_cp.,cf.osb&fp=6fc8c6804cede81f&ix=seb&ion=1&biw=1438&bih=727';
  var a = new parseUrl(urlSimple);
  a.generateKeywords();
  var b = new parseUrl(urlComplexe);
  b.generateKeywords();
  deepEqual(a.keywords,         // result
            ['keyword1', 'keyword2', 'keyword3'], // expected
            'unexpected keywords');

  deepEqual(b.keywords,
            ['jennifer', 'aniston'],
            'unexpected keywords');
});

// "http://www.google.fr/search?aq=f&ix=seb&sourceid=chrome&ie=UTF-8&q=chrome+history+api"
// "http://www.google.fr/webhp?sourceid=chrome-instant&ix=seb&ie=UTF-8&ion=1#hl=fr&output=search&sclient=psy-ab&q=chrome%20history%20api&pbx=1&oq=&aq=&aqi=&aql=&gs_sm=&gs_upl=&fp=d03a2f7d1c3b36fe&ix=seb&ion=1&bav=on.2,or.r_gc.r_pw.r_cp.r_qf.,cf.osb&biw=1219&bih=669"
