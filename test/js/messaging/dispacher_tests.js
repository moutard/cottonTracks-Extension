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

test('test publish message to suscriber.', function(){
  var oDispacher = new Cotton.Messaging.Dispacher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  var dTestArguments = {};
  oDispacher.suscribe("wake_up", oAlice, function(dArguments){
    console.log(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
  });
  ok(oDispacher);
  deepEqual(_.keys(oDispacher._dMessages), ["wake_up"]);
  oDispacher.publish('wake_up', {'say': 'it is late'});
});

test('test publish message to suscriber check this value.', function(){
  var oDispacher = new Cotton.Messaging.Dispacher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  var dTestArguments = {};
  oDispacher.suscribe("wake_up", oAlice, function(dArguments){
    console.log(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
    equal(this['name'], "Alice");
  });
  ok(oDispacher);
  deepEqual(_.keys(oDispacher._dMessages), ["wake_up"]);
  oDispacher.publish('wake_up', {'say': 'it is late'});
});

test('test pubish message to suscriber check this value.', function(){
  var oDispacher = new Cotton.Messaging.Dispacher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  var oWhiteRabbit = {'name': "White Rabbit", "direction": "Wonderland"};
  var dTestArguments = {};
  oDispacher.suscribe("wake_up", oAlice, function(dArguments){
    console.log(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
    equal(this['name'], "Alice");
  });
   oDispacher.suscribe("wake_up", oWhiteRabbit, function(dArguments){
    console.log(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
    equal(this['name'], "White Rabbit");
  });

  ok(oDispacher);
  deepEqual(_.keys(oDispacher._dMessages), ["wake_up"]);
  oDispacher.publish('wake_up', {'say': 'it is late'});
});
