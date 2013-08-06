module("Cotton.Utils.UrlParser",{
  setup: function() {
    // runs before each test
  },
  teardown: function() {
    // runs after each test
  }
});

test('understand unescape and decodeURIComponent', function() {
  var sBaseProtocol = "http%253A%252F%252F";
  // %25 -> %
  // %3A -> :
  // %2F -> /
  deepEqual(unescape(sBaseProtocol), "http%3A%2F%2F");
  deepEqual(decodeURIComponent(sBaseProtocol), "http%3A%2F%2F");

  deepEqual(unescape(unescape(sBaseProtocol)), "http://");
  deepEqual(decodeURIComponent(decodeURIComponent(sBaseProtocol)), "http://");

});

test('accent difference unescape and decodeURIComponent', function() {
  // Unescape and decodeURIComponent do not handle accent in the same way.
  var sWithAccent = "Caf%25C3%25A9";

  var sUnescaped = unescape(unescape(sWithAccent));
  var sDecoded = decodeURIComponent(decodeURIComponent(sWithAccent));

  deepEqual(sUnescaped, "CafÃ©");
  deepEqual(sDecoded, "Café")
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
  // This example has an accent.
  var urlComplexe = "https://www.google.com/search?q=alambic+talon&aq=0&um=1&ie=UTF-8&hl=fr&tbm=isch&source=og&sa=N&tab=wi&authuser=0&ei=sndkUc7qOozx0wHF1IHIBw&biw=1184&bih=702&sei=PHhkUYjgBILZ0wHrhoHQBA#imgrc=AtZ35Po07jpgPM%3A%3BYg7c9zL6WwfWBM%3Bhttp%253A%252F%252F3.bp.blogspot.com%252F-R66X-DI0C5A%252FT_wSaIK7ogI%252FAAAAAAAAZqU%252FMFoC5Xv34b4%252Fs400%252F22-Alambic%252BDieudonn%25C3%25A9%252BCorydon%252BTalon.png%3Bhttp%253A%252F%252Fwww.oldschoolpanini.com%252F2012%252F07%252Fle-top-ten-des-sosies-de-la-bd-en.html%3B302%3B211";
  var b = new UrlParser(urlComplexe);
  b.fineDecomposition();
  // keywords are not generated for webph, they are only generated for search path name.
  deepEqual(b.searchImage,
            "http://3.bp.blogspot.com/-R66X-DI0C5A/T_wSaIK7ogI/AAAAAAAAZqU/MFoC5Xv34b4/s400/22-Alambic+Dieudonné+Corydon+Talon.png");
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

test("google maps.", function() {
  var urlMaps = 'https://maps.google.com/maps?q=lyon,+france&ie=UTF-8&hq=&hnear=0x47f4ea516ae88797:0x408ab2ae4bb21f0,Lyon,+France&ei=yvXiUfuNK7DxiQKZ-YHYCw&ved=0CK0BELYD';
  var a = new UrlParser(urlMaps);
  ok(a.isGoogleMaps);
});

test("new google maps.", function() {
  var urlNewMaps = "https://www.google.com/maps/preview#!q=1er+Arrondissement%2C+Paris%2C+France&data=!1m4!1m3!1d9597!2d2.3359215!3d48.8619985!4m11!1m10!4m8!1m3!1d213870!2d-71.5650318!3d-33.1163954!3m2!1i1024!2i768!4f13.1!17b1";
  var a = new UrlParser(urlNewMaps);
  ok(a.isGoogleMaps);
});

test('do not pass directly an encodedURI to the UrlParser', function(){

  // This can not happen. has we never put directly an encodeURI in the
  // UrlParser.
  var sEncodedUrl = "http%253A%252F%252Fshippingcontainerprojects.com%252Fwp-content%252Fuploads%252F2013%252F01%252Fshipping_container_building_platoon_berlin-6.jpg";
  var oNoErrorWithUnescape = new UrlParser(unescape(sEncodedUrl));
  var oNoErrorWithDecodeURI = new UrlParser(decodeURIComponent(sEncodedUrl));
  throws(function() { new UrlParser(sEncodedUrl) }); // This create an error as there is no /
  // to split the url.
  equal(oNoErrorWithUnescape.error.code, 0);
  equal(oNoErrorWithDecodeURI.error.code, 0);

});

test('URI malformed', function(){
   var a = new UrlParser("http://fr.wiktionary.org/wiki/%20son%20travail%20pour%20avoir%20donn%E9%20une%20gifle%20%E0%20son%20employeur.%20Ch%F4meur%2C%20il%20part%2C%20en%20pleine%20crise%20industrielle%2C%20dans%20le%20Nord%20de%20la%20france%2C%20%E0%20la%20recherche%20d%u2019un%20nouvel%20emploi.%20Il%20se%20fait%20embaucher%20aux%20mines%20de%20Montsou%20et%20conna%EEt%20des%20conditions%20de%20travail%20effroyables%20.%20%0AIl%20fait%20la%20connaissance%20d%20%27%20une%20famille%20de%20mineurs%2C%20les%20Maheu%20et%20tombe%20amoureux%20de%20la%20jeune%20Catherine.%20Mais%20celle-ci%20est%20la%20ma%EEtresse%20d%20%27%20un%20ouvrier%20brutal%2C%20Chaval%2C%20et%20bien%20qu%20%27%20elle%20ne%20soie%20pas%20insensible%20%E0%20Etienne%2C%20elle%20a%20%E0%20son%20%E9gard%20une%20attitude%20%E9trange.%20%0A%0AEtienne%20s%20%27%20int%E8gre%20vite%20parmi%20le%20peuple%20des%20mineurs.%20Il%20est%20r%E9volt%E9%20par%20l%20%27%20injustice%20qu%20%27%20il%20d%E9couvre%20et%20par%20les%20conditions%20de%20vie%20des%20mineurs.%20Il%20propage%20assez%20rapidement%20des%20id%E9es%20r%E9volutionnaires.%20");
   deepEqual(a.error.message, 'URI malformed')
   deepEqual(a.error.code, 1)
});


test('url with url after 2 steps of decodeURIComponent', function(){
  var urlComplexe = "https://www.google.com/search?q=alambic+talon&aq=0&um=1&ie=UTF-8&hl=fr&tbm=isch&source=og&sa=N&tab=wi&authuser=0&ei=sndkUc7qOozx0wHF1IHIBw&biw=1184&bih=702&sei=PHhkUYjgBILZ0wHrhoHQBA#imgrc=AtZ35Po07jpgPM%3A%3BYg7c9zL6WwfWBM%3Bhttp%253A%252F%252F3.bp.blogspot.com%252F-R66X-DI0C5A%252FT_wSaIK7ogI%252FAAAAAAAAZqU%252FMFoC5Xv34b4%252Fs400%252F22-Alambic%252BDieudonn%25C3%25A9%252BCorydon%252BTalon.png%3Bhttp%253A%252F%252Fwww.oldschoolpanini.com%252F2012%252F07%252Fle-top-ten-des-sosies-de-la-bd-en.html%3B302%3B211";

  var sUrl = "https://www.google.com/search?q=alambic+talon&aq=0&um=1&ie=UTF-8&hl=fr&tbm=isch&source=og&sa=N&tab=wi&authuser=0&ei=sndkUc7qOozx0wHF1IHIBw&biw=1184&bih=702&sei=PHhkUYjgBILZ0wHrhoHQBA#imgrc=AtZ35Po07jpgPM:;Yg7c9zL6WwfWBM;http://3.bp.blogspot.com/-R66X-DI0C5A/T_wSaIK7ogI/AAAAAAAAZqU/MFoC5Xv34b4/s400/22-Alambic+Dieudonné+Corydon+Talon.png;http://www.oldschoolpanini.com/2012/07/le-top-ten-des-sosies-de-la-bd-en.html;302;211";

  deepEqual(decodeURIComponent(decodeURIComponent(urlComplexe)), sUrl);
  var oWrongResult = new UrlParser(sUrl); // This create an error as there is no /
  // As we split parts using '/' if it not escaped there are mani parts. and we don't put
  // them together well.
  deepEqual(oWrongResult.searchImage, 'http:');
});
