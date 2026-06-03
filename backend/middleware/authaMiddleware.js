const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Middleware to verify if the incoming request comes from an authorized store administrator
exports.isAdmin = async (req, res, next) => {
  try {
    let token;

    // 1. Extract the JWT token from the Authorization Header (Bearer Token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // 🎯 FIXED: Added safe optional chaining (?.) to prevent crashes on DELETE requests when req.body is undefined
    else {
      token = req.headers["x-auth-token"] || req.body?.token;
    }

    // 🎯 FIXED: Added safe optional chaining (?.) here as well
    const rawRoleHeader = req.headers["role"] || req.body?.role;

    // 3. Evaluate Authorization Gateway
    if (token) {
      // Decode the token using your JWT secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
      
      // Look up the user from the database cluster using the ID packed inside the token
      const user = await User.findById(decoded.id);

      if (user && user.role === "admin") {
        req.user = user; // Attach the authenticated user object to the request
        return next(); // 🔓 Security clearance granted! Proceed to controller.
      }
    } else if (rawRoleHeader === "admin") {
      // Allow development headers to pass if no token architecture is in place yet
      return next();
    }

    // 4. Deny access if conditions fail
    return res.status(403).json({
      success: false,
      message: "❌ Access Denied: This dashboard repository is strictly reserved for the shop owner.",
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `🔒 Authorization Failed: ${error.message}`,
    });
  }
};