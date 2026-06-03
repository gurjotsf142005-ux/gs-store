// Require Core Modules
const express = require("express")
const cors =require("cors")
const mongoose =require("mongoose")

//import custom product router at the top
const productRoute=require("./routes/productRoutes")
const userRoutes=require('./routes/userRoutes')
const orderRoutes = require("./routes/orderRoute");



// Configure dotenv to look directly inside the config folder
require("dotenv").config({path:"./config/.env"});//Reads variables from your hidden .env file

const connectDB=require("./config/DB")
//  Express appllication
const app = express();

//calling database 
connectDB();

//mounting Essential Middlewares
app.use(cors());//ALlows your React frontend to communicate with this api safely.
app.use(express.json())// Configuration that allows your server to read incoming JSON payloads

//Importing router
app.use("/api/products",productRoute)
app.use("/api/user",userRoutes)
app.use("/api/order",orderRoutes);

//Port Configuration
const PORT=process.env.PORT||8000;

app.listen(PORT,()=>{
  console.log(`SERVER IS WPRKING ON HTTP://localhost:${PORT}`);
  
})