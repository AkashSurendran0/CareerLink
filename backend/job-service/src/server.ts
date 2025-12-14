import express from 'express'
import { dbConnect } from './infrastructure/database/Mongoose'
import JobRoutes from './routes/JobRoutes'
import cookieParser from 'cookie-parser'
import { rabbitmqService } from './utils/Rabbitmq'

const app=express()
dbConnect()

app.use(express.json())
app.use(cookieParser())
rabbitmqService.connect()

  
app.use('/v1', JobRoutes)

app.listen(5005, ()=>{
    console.log('Job service is running')
})