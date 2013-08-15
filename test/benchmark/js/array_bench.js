function create_list(iLength){
  var lList = [];
  for(var i = 1; i < iLength; i++){
    lList.push(i);
  }
  return lList;
}

var length_vs_end_of_array = new Benchmark.Suite;

//add tests
length_vs_end_of_array.add('iLength', function() {
var lList = create_list(10000);
var l = lList.length;
var fCosine = 0;
var newList = [];
for (var i = 0; i < l ; i++) {
  var sDimension = lList[i];
  newList.push(sDimension);
}
}).add('array[i]', function() {
var lList = create_list(10000);
var l = lList.length;
var fCosine = 0;
var newList = [];
for (var i = 0; i < l ; i++) {
  newList.push(lList[i]);
}
}).add('init.length', function() {
var lList = create_list(10000);
var fCosine = 0;
var newList = [];
for (var i = 0, l = lList.length; i < l ; i++) {
  var sDimension = lList[i];
  newList.push(sDimension);
}
}).add('array.length', function() {
var lList = create_list(10000);
var fCosine = 0;
var newList = [];
for (var i = 0; i < lList.length ; i++) {
  var sDimension = lList[i];
  newList.push(sDimension);
}
}).add('declare_variable', function() {
var lList = create_list(10000);
var l = lList.length;
var fCosine = 0;
var newList = [];
for (var i = 0, sDimension; i < l ; i++) {
  sDimension = lList[i];
  newList.push(sDimension);
}
}).add('double_condition', function() {
var lList = create_list(10000);
var l = lList.length;
var fCosine = 0;
var newList = [];
for (var i = 0; (i < l) && (sDimension = lList[i]); i++) {
  newList.push(sDimension);
}
}).add('endOfArray', function() {
var lList = create_list(10000);
var fCosine = 0;
var newList = [];
for (var i = 0, sDimension; sDimension = lList[i] ; i++) {
  sDimension = lList[i];
  newList.push(sDimension);
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

