const mongoose = require("mongoose");

module.exports = async function fixIndexes() {
  try {
    const db = mongoose.connection;
    if (!db || !db.db) return;
    const collection = db.db.collection("cartitems");
    const indexes = await collection.listIndexes().toArray();

    // Drop legacy wrong index if present (user_1_product_1 on non-existent fields)
    const legacy = indexes.find((idx) => idx.name === "user_1_product_1");
    if (legacy) {
      try {
        await collection.dropIndex("user_1_product_1");
        // no-op
      } catch (_) {}
    }

    // Align indexes with Mongoose model definition
    try {
      // Defer requiring model until after connection
      const CartItem = require("../models/CartItem");
      await CartItem.syncIndexes();
    } catch (_) {}
  } catch (err) {
    // swallow index maintenance errors
  }
};


