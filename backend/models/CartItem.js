const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    size: { type: String, required: false },
    color: { type: String, required: false },
    price: { type: Number, required: true }, // Store price at time of adding to cart
    originalPrice: { type: Number, required: false }, // For sale prices
    selectedAttributes: { type: Map, of: String, default: {} }, // For custom attributes
  },
  { timestamps: true }
);

// Ensure a unique compound index per user-product-size-color so we don't duplicate identical items
cartItemSchema.index({ userId: 1, productId: 1, size: 1, color: 1 }, { unique: true });

module.exports = mongoose.model("CartItem", cartItemSchema);
