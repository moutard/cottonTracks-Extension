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

test("hash.", function() {
  var urlComplexe = 'https://www.google.fr/search?q=underscore+js&aq=f&oq=underscore+js&aqs=chrome.0.57j60l3j0j62.3248j0&sourceid=chrome&ie=UTF-8#hl=fr&sclient=psy-ab&q=alice+in+wonderland&oq=alice+in+wonderland&gs_l=serp.3..0l4.52469.52469.0.52763.1.1.0.0.0.0.168.168.0j1.1.0...0.0...1c.2.8.psy-ab.J06Cu2VWQiA&pbx=1&bav=on.2,or.r_cp.r_qf.&bvm=bv.44770516,d.dmg&fp=eff218f351fb2648&biw=1214&bih=576';
  var b = new UrlParser(urlComplexe);

  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.hash, "hl=fr&sclient=psy-ab&q=alice+in+wonderland&oq=alice+in+wonderland&gs_l=serp.3..0l4.52469.52469.0.52763.1.1.0.0.0.0.168.168.0j1.1.0...0.0...1c.2.8.psy-ab.J06Cu2VWQiA&pbx=1&bav=on.2,or.r_cp.r_qf.&bvm=bv.44770516,d.dmg&fp=eff218f351fb2648&biw=1214&bih=576");
});

test("hash query words.", function() {
  var urlComplexe = 'https://www.google.fr/search?q=underscore+js&aq=f&oq=underscore+js&aqs=chrome.0.57j60l3j0j62.3248j0&sourceid=chrome&ie=UTF-8#hl=fr&sclient=psy-ab&q=alice+in+wonderland&oq=alice+in+wonderland&gs_l=serp.3..0l4.52469.52469.0.52763.1.1.0.0.0.0.168.168.0j1.1.0...0.0...1c.2.8.psy-ab.J06Cu2VWQiA&pbx=1&bav=on.2,or.r_cp.r_qf.&bvm=bv.44770516,d.dmg&fp=eff218f351fb2648&biw=1214&bih=576';
  var b = new UrlParser(urlComplexe);

  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.keywords,
            ['alice',
            'in',
            'wonderland']);
});

test("imgres.", function() {
  var urlComplexe = "http://www.google.fr/imgres?imgurl=http://www.onlinesupermario.com/images/realmario.JPG&imgrefurl=http://www.onlinesupermario.com/&h=1024&w=1024&sz=101&tbnid=ikAWyn3UwDAgbM:&tbnh=90&tbnw=90&zoom=1&usg=__tVg2-irLdbHutqPuLoSuLOjRkYs=&docid=MLN8e-FAkD48tM&sa=X&ei=36hgUahkp4bbBc7YgfgD&ved=0CEwQ9QEwAg";
  var b = new UrlParser(urlComplexe);

  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.search,
            "imgurl=http://www.onlinesupermario.com/images/realmario.JPG&imgrefurl=http://www.onlinesupermario.com/&h=1024&w=1024&sz=101&tbnid=ikAWyn3UwDAgbM:&tbnh=90&tbnw=90&zoom=1&usg=__tVg2-irLdbHutqPuLoSuLOjRkYs=&docid=MLN8e-FAkD48tM&sa=X&ei=36hgUahkp4bbBc7YgfgD&ved=0CEwQ9QEwAg");
});

test("imgres.", function() {
  var urlComplexe = "http://www.google.fr/imgres?imgurl=http://www.onlinesupermario.com/images/realmario.JPG&imgrefurl=http://www.onlinesupermario.com/&h=1024&w=1024&sz=101&tbnid=ikAWyn3UwDAgbM:&tbnh=90&tbnw=90&zoom=1&usg=__tVg2-irLdbHutqPuLoSuLOjRkYs=&docid=MLN8e-FAkD48tM&sa=X&ei=36hgUahkp4bbBc7YgfgD&ved=0CEwQ9QEwAg";
  var b = new UrlParser(urlComplexe);
  b.fineDecomposition();
  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.dSearch['imgurl'],
            "http://www.onlinesupermario.com/images/realmario.JPG");
});

test("google image search preview.", function() {
  var urlComplexe = "https://www.google.com/search?q=alambic+talon&aq=0&um=1&ie=UTF-8&hl=fr&tbm=isch&source=og&sa=N&tab=wi&authuser=0&ei=sndkUc7qOozx0wHF1IHIBw&biw=1184&bih=702&sei=PHhkUYjgBILZ0wHrhoHQBA#imgrc=AtZ35Po07jpgPM%3A%3BYg7c9zL6WwfWBM%3Bhttp%253A%252F%252F3.bp.blogspot.com%252F-R66X-DI0C5A%252FT_wSaIK7ogI%252FAAAAAAAAZqU%252FMFoC5Xv34b4%252Fs400%252F22-Alambic%252BDieudonn%25C3%25A9%252BCorydon%252BTalon.png%3Bhttp%253A%252F%252Fwww.oldschoolpanini.com%252F2012%252F07%252Fle-top-ten-des-sosies-de-la-bd-en.html%3B302%3B211";
  var b = new UrlParser(urlComplexe);
  b.fineDecomposition();
  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.searchImage,
            "http://3.bp.blogspot.com/-R66X-DI0C5A/T_wSaIK7ogI/AAAAAAAAZqU/MFoC5Xv34b4/s400/22-Alambic+DieudonnÃ©+Corydon+Talon.png");
});

test("dribble search.", function() {
  var urlComplexe = "http://dribbble.com/search?q=karri+bonjour";
  var b = new UrlParser(urlComplexe);
  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.keywords,
            ["karri", "bonjour"]);
});

test("replacehexa.", function() {
  var urlComplexe = "http://d1jqu7g1y74ds1.cloudfront.net%252Fwp-content%252Fuploads%252F2010%252F11%252Fmilkyway.jpg";
  var b = new UrlParser(urlComplexe);
  deepEqual(b.replaceHexa(urlComplexe),
            "http://d1jqu7g1y74ds1.cloudfront.net/wp-content/uploads/2010/11/milkyway.jpg");
});
