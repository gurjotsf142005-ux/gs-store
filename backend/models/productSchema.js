const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "❌ Product name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "❌ Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    description: {
      type: String,
      required: [true, "❌ Product description is required"]
    },
    category: {
      type: String,
      required: [true, "❌ Product category is required"],
      trim: true
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/150" // Fallback placeholder URL
    },
    stock: {
      type: Number,
      required: [true, "❌ Product inventory stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 10
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Product", productSchema);