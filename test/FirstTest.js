FirstTest = TestCase("FirstTest");

FirstTest.prototype.testGetTotalWithOneBook = function() {
	var cart = new katapotter.Cart();
	var books = [{"title":"first book"}];
	assertEquals(8, cart.getTotal(books));
};

