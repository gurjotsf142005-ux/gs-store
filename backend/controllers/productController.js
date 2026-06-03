const Product = require("../models/productSchema");

// @desc    Get all products from cluster
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create brand new product entries (Supports bulk arrays or single objects)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    // 🎯 CHECK IF INCOMING CARGO IS A BULK ARRAY
    if (Array.isArray(req.body)) {
      // Validate that every single item inside the payload array has required fields
      for (const item of req.body) {
        if (!item.name || !item.price || !item.category || !item.image || !item.description) {
          return res.status(400).json({ 
            success: false, 
            message: "❌ Bulk validation failed. One or more products in your array are missing required fields." 
          });
        }
      }

      // Insert all documents into MongoDB simultaneously
      const newProducts = await Product.insertMany(req.body);
      return res.status(201).json({ success: true, products: newProducts });
    }

    // 🧔 STANDARD FALLBACK: Process single product request fields
    const { name, price, category, image, description } = req.body;

    if (!name || !price || !category || !image || !description) {
      return res.status(400).json({ success: false, message: "❌ Please fill out all required fields." });
    }

    const newProduct = await Product.create({
      name,
      price,
      category,
      image,
      description
    });

    return res.status(201).json({ success: true, products: newProduct });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an existing product document from the inventory cluster
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "❌ Product document not found." });
    }

    await Product.findByIdAndDelete(productId);
    
    res.status(200).json({ 
      success: true, 
      message: "🗑️ Product successfully wiped from store database cluster!" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `💥 Deletion failed: ${error.message}` });
  }
};