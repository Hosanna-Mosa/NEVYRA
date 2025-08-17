const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    }],
    totalAmount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Card", "COD", "Net Banking"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
    },
    billingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
    },
    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },
    trackingNumber: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
