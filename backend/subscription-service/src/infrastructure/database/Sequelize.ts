import { Sequelize } from "sequelize";
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

export const connectPSQL = async () =>{
    try {
        await sequelize.authenticate();
        await sequelize.query("SELECT 1");
        logger.info("PSQL database connected successfully!");
    } catch (error) {
        logger.error({error}, "Database connection failed");
    }
};