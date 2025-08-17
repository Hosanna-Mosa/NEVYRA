const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    price: { type: Number, required: true }, // Price at time of order
    originalPrice: { type: Number, required: false }, // Original price if there was a sale
    size: { type: String, required: false },
    color: { type: String, required: false },
    selectedAttributes: { type: Map, of: String, default: {} }, // Custom attributes
    subtotal: { type: Number, required: true }, // price * quantity
    discountAmount: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true }, // subtotal + tax - discount
  },
  { timestamps: true }
);

// Calculate totals before saving
orderItemSchema.pre('save', function(next) {
  this.subtotal = this.price * this.quantity;
  this.totalAmount = this.subtotal + this.taxAmount - this.discountAmount;
  next();
});

// Index for efficient queries
orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ productId: 1 });

module.exports = mongoose.model("OrderItem", orderItemSchema);
