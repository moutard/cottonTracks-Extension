var suite = new Benchmark.Suite;

// add tests
suite.add('RegExp#test', function() {
  /o/.test('Hello World!');
})
.add('String#indexOf', function() {
  'Hello World!'.indexOf('o') > -1;
})
.add('String#match', function() {
  !!'Hello World!'.match(/o/);
})
// add listeners
.on('cycle', function(event) {
  DEBUG && console.debug(String(event.target));
})
.on('complete', function() {
  DEBUG && console.debug('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

function create_list(iLength){
  var lList = [];
  for(var i = 1; i < iLength; i++){
    lList.push(i);
  }
  return lList;
}

function create_dict(iLength){
  var dDict = {};
  for(var i = 1; i < iLength; i++){
    dDict[i] = 42;
  }
  return dDict;
}
var underscore_suite = new Benchmark.Suite;

// add tests
underscore_suite.add('NativeFilter', function() {
  var lList = create_list(10000);
  var iMax = 800;
  lList.filter(function(i){
    return i < iMax;
  });
})
.add('UnderscoreFilter', function() {
  var lList = create_list(10000);
  var iMax = 800;
  _.filter(lList, function(i){
    return i < iMax;
  });

})
.add('ForLoopfilter', function() {
  var lList = create_list(10000);
  var iMax = 800;

  var lResult = [];
  var iLength = lList.length;
  for(var i = 0; i < iLength; i++){
    if(lList[i] < iMax){
      lResult.push(lList[i]);
    }
  }
})
.add('TrickForLoopfilter', function() {
  var lList = create_list(10000);
  var iMax = 800;

  var iLength = lList.length;
  var lResult = [];
  for(var i = 0, u; u = lList[i]; i++){
    if(u < iMax){
      lResult.push(u);
    }
  }
})
// add listeners
.on('cycle', function(event) {
  DEBUG && console.debug(String(event.target));
})
.on('complete', function() {
  DEBUG && console.debug('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

var variable_vs_accessing = new Benchmark.Suite;

//add tests
variable_vs_accessing.add('NewVariable', function() {
var lList = create_list(10000);
var dBagOfWords1 = create_dict(10000);
var dBagOfWords2 = create_dict(10000);
var l = lList.length;
var fCosine = 0;
for (var i = 0; i < l ; i++) {
  var sDimension = lList[i];
  fCosine += dBagOfWords1[sDimension] * dBagOfWords2[sDimension];
}
}).add('OneVariable', function() {
var lList = create_list(10000);
var dBagOfWords1 = create_dict(10000);
var dBagOfWords2 = create_dict(10000);
var l = lList.length;
var fCosine = 0;
for (var i = 0, sDimension; i < l ; i++) {
  sDimension = lList[i];
  fCosine += dBagOfWords1[sDimension] * dBagOfWords2[sDimension];
}
})
.add('NoVariable', function() {
  var lList = create_list(10000);
  var dBagOfWords1 = create_dict(10000);
  var dBagOfWords2 = create_dict(10000);
  var l = lList.length;
  var fCosine = 0;
  for (var i = 0; i < l ; i++) {
    fCosine += dBagOfWords1[lList[i]] * dBagOfWords2[lList[i]];
  }
})
//add listeners
.on('cycle', function(event) {
DEBUG && console.debug(String(event.target));
})
.on('complete', function() {
DEBUG && console.debug('Fastest is ' + this.filter('fastest').pluck('name'));
})
//run async
.run({ 'async': true });

var array_vs_dict = new Benchmark.Suite;

//add tests
array_vs_dict.add('Array', function() {
var lList = create_list(10000);
var l = lList.length;
for (var i = 0; i < l ; i++) {
  lList[i] += 1;
}
}).add('Dict', function() {
var dDict = create_dict(10000);
for (var sKey in dDict) {
  dDict[sKey] +=1;
}
})
//add listeners
.on('cycle', function(event) {
DEBUG && console.debug(String(event.target));
})
.on('complete', function() {
DEBUG && console.debug('Fastest is ' + this.filter('fastest').pluck('name'));
})
//run async
.run({ 'async': true });

