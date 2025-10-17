import { dbConnect } from "./config/connectDb";
import express from 'express'
import container from "./inversify.config";
import { TYPES } from "./TYPES";
import { RabbitMqService } from "./RabbitMq";


const app=express()
dbConnect();

const rabbitmqService = container.get<RabbitMqService>(TYPES.RabbitMqService);
(async ()=>{
    await rabbitmqService.connect()
    await rabbitmqService.consumeNotification()
})()

// app.use('/v1')

app.listen(5004, ()=>{
    console.log('Notification service running')
})