import express from "express";
import { connectDB } from "./infrastructure/database/Sequelize";
import V1CompanyRouter from './routes/CompanyRoutes'
import dotenv from 'dotenv'
import { rabbitmqService } from "./utils/Rabbitmq";
import { logger } from "./utils/logger";

dotenv.config()
const app=express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

connectDB();
(async () => {
rabbitmqService.connect()
})()

app.use("/v1", V1CompanyRouter)

app.listen(5003, ()=>{
    logger.info('Company service is running')
})