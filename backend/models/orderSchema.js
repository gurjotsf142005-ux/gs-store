const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: String, required: false },
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number, default: 1 },
        size: { type: String, default: "M" }
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      default: "COD",
    },
    // 📦 ENTERPRISE SHIPPING MODEL: Fully granular breakdown architecture
    shippingDetails: {
      phone: { type: String, required: true },
      houseNo: { type: String, required: true },
      streetNo: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true }
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);