const mongoose = require("mongoose");
const Product = require("./models/productSchema"); // Path to your product schema
require("dotenv").config({ path: "./config/.env" });

// 📦 Your fresh, realistic storefront dataset
const sampleProducts = [
  {
    name: "Premium Winter Sweater",
    price: 1850,
    description: "Premium knit wool blend sweater designed to pair perfectly with standard traditional attire.",
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
    stock: 12
  },
  {
    name: "Wireless Gaming Headset",
    price: 2999,
    description: "High-fidelity audio with low latency tracking and extra bass performance.",
    category: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: 15
  },
  {
    name: "Mechanical RGB Keyboard",
    price: 4500,
    description: "Tactile switches with customizable per-key dynamic RGB backlighting layouts.",
    category: "Peripherals",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    stock: 8
  },
  {
    name: "Ergonomic Wireless Mouse",
    price: 1800,
    description: "High precision tracking with programmable side-buttons and comfortable thumb rest.",
    category: "Peripherals",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500",
    stock: 25
  }
];

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB using your existing URI from .env
    const mongoURI = process.env.MONGO_URL || "mongodb://localhost:27017/gsmedia"; 
    await mongoose.connect(mongoURI);
    console.log("💾 Connected to MongoDB for seeding...");

    // 2. CLEAR existing validation-broken products so we start completely fresh
    await Product.deleteMany({});
    console.log("🧹 Old products cleared successfully.");

    // 3. INJECT our new, perfectly formatted products array
    await Product.insertMany(sampleProducts);
    console.log("🚀 Database seeded successfully with 4 retail items!");

    // 4. Disconnect cleanly so the terminal script exits
    await mongoose.disconnect();
    console.log("🔌 Database connection closed cleanly.");
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

// Execute the function
seedDatabase();