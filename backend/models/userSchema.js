const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add name"]
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    otp: { 
      type: String 
    },
    otpExpires: { 
      type: Date 
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

// 🛡️ ENCRYPTION GATEWAY: Standard function configuration for strict Mongoose compatibility
// 🛡️ ENCRYPTION GATEWAY: Modern Async pattern (No 'next' parameter to prevent version mapping crashes!)
userSchema.pre("save", async function () {
  // Only hash the password if it's actually being modified or created new
  if (!this.isModified("password")) {
    return; // ⚡ Just return to resolve the promise safely!
  }

  // Generate a secure encryption salt key
  const salt = await bcrypt.genSalt(10);
  
  // Mix the password with the salt to create the unreadable hash string
  this.password = await bcrypt.hash(this.password, salt);
  
  // No next() call here! Finishing the async execution automatically tells Mongoose to save.
});

module.exports = mongoose.model("User", userSchema);