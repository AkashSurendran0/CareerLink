import mongoose from "mongoose";

export const dbConnect = async () =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/careerLink");
        console.log("Mongodb connected successfully");
    } catch (error: any) {
        console.log("Mongodb connection failed", error);
    }
};