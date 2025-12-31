import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export const dbConnect = async () =>{
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:27017/careerLink`);
        console.log("Mongodb connected successfully");
    } catch (error: any) {
        console.log("Mongodb connection failed", error);
    } 
};  