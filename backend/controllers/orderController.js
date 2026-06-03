const Order = require("../models/orderSchema");

// @desc    Create a brand new order document (Frontend Checkout Action)
// @route   POST /api/order
exports.createOrder = async (req, res) => {
  try {
    // Catch paymentMode and paymentStatus from the request body cargo
    const { userId, items, totalAmount, paymentMode, paymentStatus } = req.body;

    if (!userId || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "❌ Missing required fields. Checkout array cannot be empty."
      });
    }

    // Determine default payment status based on chosen payment mode
    // If a user selects UPI/Card on the frontend, we will simulate "Paid" right away for testing
    const finalPaymentStatus = paymentStatus || (paymentMode === "COD" ? "Pending" : "Paid");

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      paymentMode: paymentMode || "COD",
      paymentStatus: finalPaymentStatus,
      status: "Pending" // Explicitly ensure standard orders default to Pending tracking layout
    });

    res.status(201).json({
      success: true,
      message: `🎉 Order placed successfully using ${paymentMode || "COD"}!`,
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `💥 Server Error placing order: ${error.message}`
    });
  }
};

// @desc    Fetch past transactions for a specific logged-in customer tab
// @route   GET /api/order
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "❌ Missing identification context: userId is required." 
      });
    }

    // Query cluster logs specifically matching this user and sort with newest on top
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: `💥 Failed to sync user tracking logs: ${error.message}` 
    });
  }
};

// @desc    Master route to pull every order in the system for the shop owner
// @route   GET /api/order/all
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email") // Attaches buyer customer details
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Modify tracking strings (Pending -> Shipped -> Delivered)
// @route   PUT /api/order/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ["Pending", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "❌ Invalid status parameters passed." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Returns the newly modified object
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "❌ Order record missing." });
    }

    res.status(200).json({ 
      success: true, 
      message: `🎉 Tracking updated to ${status}!`, 
      order: updatedOrder 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};