import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../../utils/logger";

dotenv.config();

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_ATLAS_URL as string);
        logger.info("Mongodb connected successfully");
    } catch (error: unknown) {
        if (error instanceof Error) logger.error({ err: error }, "Mongodb connection failed");
        else logger.error({ error }, "Mongodb connection failed");
    }
};