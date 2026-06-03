const express = require("express");
const router = express.Router();
const { 
  createProduct, 
  getProducts,
  deleteProduct
} = require("../controllers/productController"); 
const { isAdmin } = require("../middleware/authaMiddleware");

// 🌐 PUBLIC ROUTE: Fetch and see products
router.get("/", async (req, res) => {
  if (getProducts) {
    return getProducts(req, res);
  }
  try {
    const Product = require("../models/productSchema");
    const products = await Product.find({});
    return res.status(200).json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 🛡️ RESTRICTED ROUTES: Strictly reserved for shop owner access
router.post("/", isAdmin, createProduct);
router.delete("/:id", isAdmin, deleteProduct);

module.exports = router;