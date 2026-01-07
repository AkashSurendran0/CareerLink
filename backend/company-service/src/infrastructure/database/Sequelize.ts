import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { logger } from "../../utils/logger";

dotenv.config();

export const sequelize = new Sequelize(
    "careerlink",
    "postgres",
    "akash1",
    {
        host: `${process.env.SEQUALIZE_HOST}`,
        port: 5432,
        dialect: "postgres",
        logging: false
    }
);

export const connectDB = async () =>{
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        logger.info("PSQL database connected successfully!");
    } catch (error) {
        logger.error({error} ,"Database connection failed");
    }
}; 