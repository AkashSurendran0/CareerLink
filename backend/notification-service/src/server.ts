import { dbConnect } from "./config/connectDb";
import express from 'express'
import container from "./inversify.config";
import { TYPES } from "./types";
import { RabbitMqService } from "./RabbitMq";
import NotificationRouter from './routes/NotificationRoutes'
import { initSocket } from "./utils/Socket";
import http from 'http'

const app=express()
const server=http.createServer(app)
initSocket(server)
dbConnect();

const rabbitmqService = container.get<RabbitMqService>(TYPES.RabbitMqService);
(async ()=>{
    await rabbitmqService.connect()
    await rabbitmqService.consumeNotification()
})()
 
app.use('/v1', NotificationRouter)

server.listen(5004, ()=>{
    console.log('Notification service running')
})