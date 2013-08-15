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

