import express from "express";
import { connectMongo } from "./infrastructure/database/Mongoose";
import { connectPSQL } from "./infrastructure/database/Sequelize";
import SubscriptionRoutes from './routes/SubscriptionRoutes'
import container from "./inversify.config";
import { SubscriptionController } from "./interface/controllers/SubscriptionController";
import { TYPES } from "./types";

const subscriptionController=container.get<SubscriptionController>(TYPES.SubscriptionController)
const app=express()
connectMongo()
connectPSQL()

app.post('/v1/stripe/webhook', 
    express.raw({ type: 'application/json' }),
    subscriptionController.controlWebhook
)

app.use(express.json())

app.use('/v1', SubscriptionRoutes)
 
app.listen(5008, ()=>{
    console.log('Subscription service is running')
})