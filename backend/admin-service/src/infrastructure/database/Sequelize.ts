import {Sequelize} from "sequelize";
import dotenv from "dotenv";
import { logger } from "../../utils/logger";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.SEQUALIZE_URL as string,
    {
        dialect: "postgres",
        logging: false,
        // dialectOptions: {
        // ssl: {
        //     require: true,
        //     rejectUnauthorized: false,
        // },
        // },
    }
);

export const connectDB = async () =>{ 
    try {
        await sequelize.authenticate();
        await sequelize.query("SELECT 1");
        logger.info("Admin PSQL database connected successfully");
    } catch (error: unknown) {
        if (error instanceof Error) {
            logger.error({error}, "Database connection failed");
        } else {
            logger.error({ error }, "Database connection failed");
        }
    }
}; 