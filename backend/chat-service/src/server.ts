import express from 'express';
import ChatRoutes from './routes/ChatRoutes'
import { dbConnect } from './infrastructure/database/Mongoose';
import { rabbitmqService } from './utils/Rabbitmq';

const app=express()
dbConnect()
rabbitmqService.connect()

app.use(express.json())

app.use('/v1', ChatRoutes)

app.listen(5009, ()=>{
    console.log('Chat service running')
})