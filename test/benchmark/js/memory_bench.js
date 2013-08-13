// The only global variable (like the Cotton Namespace)
// You can find the variable wonderland in the chrome profiler at the section :
// Window / file:///usr/local/rmoutard/sz/extension/test/benchmark/memory.html
var Wonderland = {};

// Character is a class you can instantiate with new keyword.
Wonderland.Character = function(sName, sDescription) {
  this._name = sName;
  this._description = sDescription;
  var sleeping = "of course";
};
Wonderland.Character.prototype.getName = function() {
  return this._name;
};
Wonderland.Character.prototype.purge = function() {
  delete this._name;
  delete this._description;
  sleeping = null;
};

// Compare space memory used by class (John Resig) vs. function
// One of the big advantage of the function is for debugging (chrome
// give a proper name of elements)
Wonderland.ClassCharacter = Class.extend({

  init: function(sName, sDescription) {
    this._name = sName;
    this._description = sDescription;
    var sleeping = "of course";
  },

  getName : function() {
    return this._name;
  },

  purge : function() {
    delete this._name;
    delete this._description;
    sleeping = null;
  }
});

// Garden is a variable that contains all the elements in the garden.
Wonderland.Garden = [];

// Characters is a variable that contains all the characters in wonderland.
Wonderland.Characters = [];


// Instanciate characters
var oAlice = new Wonderland.Character("Alice", "Young sleepy girl");
var oCat = new Wonderland.Character("Cat", "Grummy and evil cat");
var oHatMaker = new Wonderland.Character("HatMaker", "Like a cup of tea");
var oCAlice = new Wonderland.ClassCharacter("Alice", "Young sleepy girl");
var oCCat = new Wonderland.ClassCharacter("Cat", "Grummy and evil cat");
var oCHatMaker = new Wonderland.ClassCharacter("HatMaker", "Like a cup of tea");

Wonderland.Characters.push(oAlice);
Wonderland.Characters.push(oCat);
Wonderland.Characters.push(oHatMaker);

// Add flowers to the garden
for (var i = 0; i < 300000; i++) {
  Wonderland.Garden.push("red roses");
}

// Clean the Garden
// You first need to unreferenced each elements of the array,
// AND THEN, unreferenced the array, of you don't do
// Wonderland.Garden = []; then the GC keep a array of the size 9999
// With this method you go from 5.2MB to 2.2MB.
for (var i = 0; i < 300000; i++) {
  // delete Wonderland.Garden[i];
  // Both lines are equivalent.
  Wonderland.Garden[i] = null;
}
Wonderland.Garden = [];

// Clean characters.
// How to clean character properly. As there are also referenced in the array.

// Doesn't work.
//oAlice = null;
//oCat = null;
//oHatMaker = null;

for (var j = 0; j < Wonderland.Characters.length; j++) {
  Wonderland.Characters[j] = null;
}
Wonderland.Characters = [];


// This is used to find the size of a string depending of this length;
var sString00 = "";
var sString01 = "a";
// 6 characters
var sString06 = "Alice.";
// 20 characters
var sString20 = "Alice in wonderland.";
var sString35 = "Alice Alice Alice Alice Alice Alice";
var sString60 = "Alice Alice Alice Alice Alice Alice Alice Alice Alice ";
var sString70 = "Alice Alice Alice Alice Alice Alice Alice Alice Alice Alice Alice Alice";

// 600
var sBigString = "Alice becomes a guest at a mad tea party along with the March Hare, the Hatter, and a very tired Dormouse who falls asleep frequently, only to be violently woken up moments later by the March Hare and the Hatter. The characters give Alice many riddles and stories, including the famous 'Why is a raven like a writing desk?'. The Hatter reveals that they have tea all day because Time has punished him by eternally standing still at 6 pm (tea time). Alice becomes insulted and tired of being bombarded with riddles and she leaves claiming that it was the stupidest tea party that she had ever been to.";


var bTrue = true;

// - Conclusions -
// some points that are good to remind about memory management.
//
// Class (john resig) vs Function
// ------------------------------
// the prototype takes exactly the same space. As method are not duplicated
// for each instance of the object.
// We are sure of that as the reference (memory adress of functions are the
// same)
// oCat __proto__ getName @25229
// oAlice __proto__ getName @25229
// (this number can varie if you make the test the important part is they are
// equal)
//
// oCCat __proto__ getNAme @25235
// oCAlice __proto__ getNAme @25235
//
// the only difference is that there is a method init, and a constructor in the
// john resig class.
//
// The other problem with john resig class is that the type of the instance
// is "Class" instead of "Wonderland.Character" make that harder to debug,
// but the code becomes more readable.
//
// String Size
// -----------
// result find on chrome 27.0.1453.93.
//
// sString00 : 24 B (Bytes not sure that the result is in Byte.)
// sString01 : 32   (2*16 ?)
// sString06 : 32
// sString20 : 48    (3*16)
// sString35 : 64
// sString60 : 80
// sString70 : 96    (6*16)
// sBigString: 624   (39*16)
//
// Theory: each string is a finite ordered sequence of zero or more 16-bit.
// unsigned integer values.
// There is maybe a \0 string character at the end.
//
// Actually the heap takes 2.2MB (but there are a lot of stuffs that are not
// for us.)
//
