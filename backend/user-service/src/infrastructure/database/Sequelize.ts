import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    "careerlink",
    "postgres",
    "akash123",
    {
        host: "localhost",
        port: 5432,
        dialect: "postgres",
        logging: false
    }
)

export const connectDB = async () =>{
    try {
        await sequelize.authenticate()
        console.log('PSQL database connected successfully!')
    } catch (error) {
        console.log('Database connection failed', error)
    }
}