import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../../utils/logger";

dotenv.config();

export const connectMongo = async () =>{
    try {
        await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:27017/careerLink`);
        logger.info("Mongodb connected successfully");
    } catch (error: unknown) {
        if (error instanceof Error) logger.error("Mongodb connection failed", { message: error.message });
        else logger.error("Mongodb connection failed", { error });
    }
};