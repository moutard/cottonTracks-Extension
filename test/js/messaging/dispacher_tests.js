module('Cotton.Messaging.Dispacher', {});

test('init.', function(){
  var oDispacher = new Cotton.Messaging.Dispacher();
  ok(oDispacher);
});

test('test send message with no suscriber.', function(){
  var oDispacher = new Cotton.Messaging.Dispacher();
  oDispacher.send('test', {'status': 0})
  ok(oDispacher);
});

test('test suscribe.', function(){
  var oDispacher = new Cotton.Messaging.Dispacher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  oDispacher.suscribe("wake_up", oAlice, function(dArguments){
    console.log(dArguments);
  });
  ok(oDispacher);
  deepEqual(_.keys(oDispacher._dMessages), ["wake_up"]);
});

test('test send message to suscriber.', function(){
  var oDispacher = new Cotton.Messaging.Dispacher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  var dTestArguments = {};
  oDispacher.suscribe("wake_up", oAlice, function(dArguments){
    console.log(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
  });
  ok(oDispacher);
  deepEqual(_.keys(oDispacher._dMessages), ["wake_up"]);
  oDispacher.send('wake_up', {'say': 'it is late'});
});
