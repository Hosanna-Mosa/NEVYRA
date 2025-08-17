const path = require("path");

module.exports = {
  User: require(path.join(__dirname, "User.js")),
  Admin: require(path.join(__dirname, "Admin.js")),
  Product: require(path.join(__dirname, "Product.js")),
  Order: require(path.join(__dirname, "Order.js")),
  OrderItem: require(path.join(__dirname, "OrderItem.js")),
  CartItem: require(path.join(__dirname, "CartItem.js")),
  Category: require(path.join(__dirname, "Category.js")),
};
