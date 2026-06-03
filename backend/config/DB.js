const mongoose=require("mongoose")
 const connectDB= async()=>{
  try{
    //connecting using the URL from your config/.env file
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongoose compass local connection safely:${conn.connection.host}💾`);
    

  }catch(error){
console.log(`data base connection is critical failure:${error.message}`);
process.exit(1);//shuts down the process if connection fail

  }
 }
 module.exports=connectDB