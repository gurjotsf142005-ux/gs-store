const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  getUserOrders,
  getAllOrders,       // 📦 Master listing for owner view
  updateOrderStatus   // 🔄 State modifier method
} = require("../controllers/orderController");
const { isAdmin } = require("../middleware/authaMiddleware");

// Customer standard endpoint actions
router.post("/", createOrder);
router.get("/", getUserOrders);

// 🛡️ Admin secure dashboard management endpoints
router.get("/all", isAdmin, getAllOrders);
router.put("/:id/status", isAdmin, updateOrderStatus);

module.exports = router;