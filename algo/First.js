var katapotter = {};

katapotter.Cart = function () {};
katapotter.Cart.prototype.getTotal = function(books) {
    return books.length * 8;
};