import express from "express";
import { connectMongo } from "./infrastructure/database/Mongoose";
import { connectPSQL } from "./infrastructure/database/Sequelize";
import SubscriptionRoutes from './routes/SubscriptionRoutes'

const app=express()
connectMongo()
connectPSQL()

app.use(express.json())

app.use('/v1', SubscriptionRoutes)
 
app.listen(5008, ()=>{
    console.log('Subscription service is running')
})