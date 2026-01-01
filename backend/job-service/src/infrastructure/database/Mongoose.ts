import mongoose from "mongoose";
import dotenv from "dotenv"
import { logger } from "../../utils/logger";

dotenv.config()

export const dbConnect = async () =>{
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:27017/careerLink`);
        logger.info("Mongodb connected successfully");
    } catch (error: any) {
        logger.error({error}, "Mongodb connection failed");
    }
};