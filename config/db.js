import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectdb = async () => { 
  try{
    const connection = await mongoose.connect(process.env.MONGO_URL)
    console.log("MongoDB connected");
  }
  catch(e){
    console.log("MongoDB connection failed", e);
  }
}  
connectdb();
export default connectdb;