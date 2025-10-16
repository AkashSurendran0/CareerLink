import express from "express";
import { connectDB } from "./infrastructure/database/Sequelize";
import V1CompanyRouter from './routes/CompanyRoutes'
import dotenv from 'dotenv'
import { rabbitmqService } from "./utils/Rabbitmq";

dotenv.config()
const app=express()

app.use(express.json())

connectDB();
(async () => {
rabbitmqService.connect()
})()

app.use("/v1", V1CompanyRouter)

app.listen(5003, ()=>{
    console.log('Company service is running')
})