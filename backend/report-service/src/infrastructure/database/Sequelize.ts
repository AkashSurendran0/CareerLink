import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { logger } from "../../utils/logger";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

export const sequelize = new Pool({
    connectionString: process.env.SEQUALIZE_URL as string,
    ssl: {
        rejectUnauthorized: false
    }
});

export const connectPSQL = async () =>{
    try {
        await sequelize.connect();
        await sequelize.query("SELECT 1");
        logger.info("PSQL database connected successfully!");
    } catch (error) {
        logger.error({error}, "Database connection failed");
    }
};