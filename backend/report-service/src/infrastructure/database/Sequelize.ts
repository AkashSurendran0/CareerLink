import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config()

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

export const connectPSQL = async () =>{
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("PSQL database connected successfully!");
    } catch (error) {
        console.log("Database connection failed", error);
    }
};