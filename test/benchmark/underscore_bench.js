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
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

function create_list(iLength){
  var lList = [];
  for(var i = 0; i < iLength; i++){
    lList.push(i);
  }
  return lList;
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

  var iLength = lList.length;
  var lResult = [];
  for(var i = 0; i < iLength; i++){
    if(lList[i] < iMax);
    lResult.push(lList[i]);
  }
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

