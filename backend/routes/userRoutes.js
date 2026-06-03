const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

// Post routes for auth operations
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;