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

// Index for efficient queries
cartItemSchema.index({ userId: 1, productId: 1 });

module.exports = mongoose.model("CartItem", cartItemSchema);
