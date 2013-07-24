module('Cotton.Messaging.Dispatcher', {});

test('init.', function(){
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  ok(oDispatcher);
});

test('test send message with no subscriber.', function(){
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  oDispatcher.publish('test', {'status': 0})
  ok(oDispatcher);
});

test('test subscribe.', function(){
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  oDispatcher.subscribe("wake_up", oAlice, function(dArguments){
    DEBUG && console.debug(dArguments);
  });
  ok(oDispatcher);
  deepEqual(_.keys(oDispatcher._dMessages), ["wake_up"]);
});

test('test publish message to subscriber.', function(){
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  var dTestArguments = {};
  oDispatcher.subscribe("wake_up", oAlice, function(dArguments){
    DEBUG && console.debug(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
  });
  ok(oDispatcher);
  deepEqual(_.keys(oDispatcher._dMessages), ["wake_up"]);
  oDispatcher.publish('wake_up', {'say': 'it is late'});
});

test('test publish message to subscriber check this value.', function(){
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  var dTestArguments = {};
  oDispatcher.subscribe("wake_up", oAlice, function(dArguments){
    DEBUG && console.debug(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
    equal(this['name'], "Alice");
  });
  ok(oDispatcher);
  deepEqual(_.keys(oDispatcher._dMessages), ["wake_up"]);
  oDispatcher.publish('wake_up', {'say': 'it is late'});
});

test('test pubish message to subscriber check this value.', function(){
  var oDispatcher = new Cotton.Messaging.Dispatcher();
  var oAlice = {'name': "Alice", "direction": "Wonderland"};
  var oWhiteRabbit = {'name': "White Rabbit", "direction": "Wonderland"};
  var dTestArguments = {};
  oDispatcher.subscribe("wake_up", oAlice, function(dArguments){
    DEBUG && console.debug(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
    equal(this['name'], "Alice");
  });
   oDispatcher.subscribe("wake_up", oWhiteRabbit, function(dArguments){
    DEBUG && console.debug(dArguments);
    deepEqual(dArguments, {'say': 'it is late'});
    equal(this['name'], "White Rabbit");
  });

  ok(oDispatcher);
  deepEqual(_.keys(oDispatcher._dMessages), ["wake_up"]);
  oDispatcher.publish('wake_up', {'say': 'it is late'});
});
